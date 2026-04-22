import { error, redirect } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const sessionId = url.searchParams.get('session_id');
	if (!sessionId) throw redirect(302, '/');

	const session = await stripe.checkout.sessions.retrieve(sessionId);

	if (session.payment_status !== 'paid') {
		throw error(400, 'Payment not completed');
	}

	return {
		email: session.customer_details?.email ?? null,
		amountTotal: session.amount_total ?? 0,
		currency: (session.currency ?? 'usd').toUpperCase()
	};
};
