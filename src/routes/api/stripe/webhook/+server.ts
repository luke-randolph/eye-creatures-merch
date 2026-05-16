import { env } from '$env/dynamic/private';
import { and, eq } from 'drizzle-orm';
import { stripe } from '$lib/server/stripe';
import { db } from '$lib/server/db';
import { orders, type ShippingAddressSnapshot } from '$lib/server/db/orders.schema';
import { user } from '$lib/server/db/auth.schema';
import type { RequestHandler } from './$types';
import type Stripe from 'stripe';

const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
if (!STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET is not set');

export const POST: RequestHandler = async ({ request }) => {
	const sig = request.headers.get('stripe-signature');
	if (!sig) return new Response('Missing signature', { status: 400 });

	const rawBody = await request.text();

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Invalid signature';
		return new Response(`Webhook signature error: ${message}`, { status: 400 });
	}

	if (event.type === 'checkout.session.completed') {
		await markOrderPaid(event.data.object);
	} else if (event.type === 'checkout.session.expired') {
		// Checkout was abandoned or timed out — retire the pending row.
		await db
			.update(orders)
			.set({ status: 'expired' })
			.where(and(eq(orders.stripeSessionId, event.data.object.id), eq(orders.status, 'pending')));
	}

	return new Response(null, { status: 200 });
};

// Flip the `pending` row to `paid`, adding the total and shipping from Stripe.
async function markOrderPaid(session: Stripe.Checkout.Session) {
	const [pending] = await db
		.select({ userId: orders.userId })
		.from(orders)
		.where(eq(orders.stripeSessionId, session.id))
		.limit(1);

	if (!pending) {
		// Checkout always inserts the row first, so this shouldn't happen.
		console.error(`[webhook] no pending order for session ${session.id}`);
		return;
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

	// Link a guest checkout to an existing account when the email matches.
	let userId = pending.userId;
	if (!userId && email) {
		const [existing] = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, email))
			.limit(1);
		userId = existing?.id ?? null;
	}

	await db
		.update(orders)
		.set({
			status: 'paid',
			email,
			amountTotal: session.amount_total ?? 0,
			currency: session.currency ?? 'usd',
			stripePaymentIntentId:
				typeof session.payment_intent === 'string' ? session.payment_intent : null,
			shippingName: shipping?.name ?? null,
			shippingAddress,
			userId
		})
		.where(eq(orders.stripeSessionId, session.id));
}
