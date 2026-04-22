import { redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/orders.schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/sign-in?redirectTo=/orders');
	}

	const rows = await db
		.select()
		.from(orders)
		.where(eq(orders.userId, locals.user.id))
		.orderBy(desc(orders.createdAt));

	return { orders: rows };
};
