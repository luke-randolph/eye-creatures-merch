import { categoryLabel } from '$lib/categories';
import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import type { Category, Product } from '$lib/types';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const activeCategory = url.searchParams.get('category');

	const allRows = await db.select().from(product);

	const categories: Category[] = [...new Set(allRows.map((r) => r.category))]
		.sort()
		.map((value) => ({ value, label: categoryLabel(value) }));

	const filteredRows = activeCategory
		? await db.select().from(product).where(eq(product.category, activeCategory))
		: allRows;

	const products: Product[] = filteredRows.map((r) => ({
		id: r.id,
		slug: r.slug,
		name: r.name,
		category: r.category,
		price: r.price,
		description: r.description,
		sizes: r.sizes,
		colors: r.colors
	}));

	return { products, categories, activeCategory };
};
