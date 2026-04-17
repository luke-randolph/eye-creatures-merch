import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import type { Product } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const rows = await db.select().from(product);
	const products: Product[] = rows.map((r) => ({
		id: r.id,
		slug: r.slug,
		name: r.name,
		price: r.price,
		description: r.description,
		image: r.image,
		sizes: r.sizes
	}));
	return { products };
};
