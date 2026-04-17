import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import type { Product } from '$lib/types';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [row] = await db.select().from(product).where(eq(product.slug, params.slug)).limit(1);

	if (!row) {
		error(404, 'Product not found');
	}

	const p: Product = {
		id: row.id,
		slug: row.slug,
		name: row.name,
		category: row.category,
		price: row.price,
		description: row.description,
		sizes: row.sizes,
		colors: row.colors
	};
	return { product: p };
};
