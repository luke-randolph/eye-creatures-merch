import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/orders.schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(303, `/sign-in?redirectTo=/orders/${params.id}`);
	}

	const [order] = await db.select().from(orders).where(eq(orders.id, params.id)).limit(1);

	if (!order || order.userId !== locals.user.id || order.status !== 'paid') {
		throw error(404, 'Order not found');
	}

	return { order };
};
