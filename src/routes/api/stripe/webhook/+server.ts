import { env } from '$env/dynamic/private';
import { eq } from 'drizzle-orm';
import { stripe } from '$lib/server/stripe';
import { db } from '$lib/server/db';
import {
	orders,
	type OrderItemSnapshot,
	type ShippingAddressSnapshot
} from '$lib/server/db/orders.schema';
import { user } from '$lib/server/db/auth.schema';
import type { RequestHandler } from './$types';
import type Stripe from 'stripe';

if (!env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET is not set');

export const POST: RequestHandler = async ({ request }) => {
	const sig = request.headers.get('stripe-signature');
	if (!sig) return new Response('Missing signature', { status: 400 });

	const rawBody = await request.text();

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Invalid signature';
		return new Response(`Webhook signature error: ${message}`, { status: 400 });
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;

		let items: OrderItemSnapshot[] = [];
		const raw = session.metadata?.cartItems;
		if (raw) {
			try {
				items = JSON.parse(raw) as OrderItemSnapshot[];
			} catch {
				items = [];
			}
		}

		const shipping = session.collected_information?.shipping_details ?? null;
		const address = shipping?.address ?? null;
		const shippingAddress: ShippingAddressSnapshot | null = address
			? {
					line1: address.line1 ?? null,
					line2: address.line2 ?? null,
					city: address.city ?? null,
					state: address.state ?? null,
					postalCode: address.postal_code ?? null,
					country: address.country ?? null
				}
			: null;

		const email = session.customer_details?.email ?? '';

		let userId: string | null = session.metadata?.userId ?? null;
		if (!userId && email) {
			const [existing] = await db
				.select({ id: user.id })
				.from(user)
				.where(eq(user.email, email))
				.limit(1);
			userId = existing?.id ?? null;
		}

		await db
			.insert(orders)
			.values({
				id: crypto.randomUUID(),
				stripeSessionId: session.id,
				stripePaymentIntentId:
					typeof session.payment_intent === 'string' ? session.payment_intent : null,
				email,
				amountTotal: session.amount_total ?? 0,
				currency: session.currency ?? 'usd',
				status: 'paid',
				items,
				shippingName: shipping?.name ?? null,
				shippingAddress,
				userId
			})
			.onConflictDoNothing({ target: orders.stripeSessionId });
	}

	return new Response(null, { status: 200 });
};
