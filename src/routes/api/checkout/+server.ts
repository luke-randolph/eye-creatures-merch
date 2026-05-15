import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { stripe } from '$lib/server/stripe';
import { getProductBySlug } from '$lib/server/sanity/products';
import { db } from '$lib/server/db';
import { orders, type OrderItemSnapshot } from '$lib/server/db/orders.schema';
import type { RequestHandler } from './$types';

type IncomingItem = {
	productId: string;
	slug: string;
	size: string | null;
	colorHex: string | null;
	quantity: number;
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = (await request.json().catch(() => null)) as { items?: IncomingItem[] } | null;
	const incoming = body?.items;
	if (!Array.isArray(incoming) || incoming.length === 0) {
		throw error(400, 'Cart is empty');
	}

	const validated = await Promise.all(
		incoming.map(async (item) => {
			if (!item?.slug || !Number.isInteger(item.quantity) || item.quantity < 1) {
				throw error(400, 'Invalid cart item');
			}

			const product = await getProductBySlug(item.slug);
			if (!product) throw error(400, `Product not found: ${item.slug}`);

			const color = item.colorHex
				? (product.colors?.find((c) => c.hex === item.colorHex) ?? null)
				: null;
			if (item.colorHex && !color) throw error(400, `Color not found for ${product.name}`);
			if (item.size && !product.sizes?.includes(item.size)) {
				throw error(400, `Size not found for ${product.name}`);
			}

			const unitAmount = Math.round(product.price * 100);
			const variantSuffix = [item.size, color?.label].filter(Boolean).join(' / ');
			const displayName = variantSuffix ? `${product.name} — ${variantSuffix}` : product.name;
			const imageUrl = color?.imageUrl ?? product.imageUrl;

			return {
				lineItem: {
					quantity: item.quantity,
					price_data: {
						currency: 'usd',
						unit_amount: unitAmount,
						product_data: {
							name: displayName,
							images: imageUrl ? [imageUrl] : undefined
						}
					}
				},
				snapshot: {
					productId: product.id,
					slug: product.slug,
					name: product.name,
					size: item.size,
					colorHex: color?.hex ?? null,
					colorLabel: color?.label ?? null,
					quantity: item.quantity,
					unitAmount
				} satisfies OrderItemSnapshot
			};
		})
	);

	const origin = env.ORIGIN ?? 'http://localhost:5173';

	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: validated.map((v) => v.lineItem),
		shipping_address_collection: { allowed_countries: ['US'] },
		shipping_options: [
			{
				shipping_rate_data: {
					type: 'fixed_amount',
					fixed_amount: { amount: 0, currency: 'usd' },
					display_name: 'Free shipping'
				}
			}
		],
		success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${origin}/checkout/cancel`,
		...(locals.user ? { customer_email: locals.user.email } : {})
	});

	if (!session.url) throw error(500, 'Stripe did not return a checkout URL');

	// Persist the cart as a `pending` order; the webhook flips it to `paid`.
	// Kept in our DB, not Stripe metadata, which caps values at 500 chars.
	const items = validated.map((v) => v.snapshot);
	await db.insert(orders).values({
		id: crypto.randomUUID(),
		stripeSessionId: session.id,
		email: locals.user?.email ?? '',
		amountTotal: items.reduce((sum, it) => sum + it.unitAmount * it.quantity, 0),
		currency: 'usd',
		status: 'pending',
		items,
		userId: locals.user?.id ?? null
	});

	return json({ url: session.url });
};
