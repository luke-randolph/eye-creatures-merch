import { categoryLabel } from '$lib/categories';
import { getAllProducts, getProductsByCategory } from '$lib/server/sanity/products';
import type { Category } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const activeCategory = url.searchParams.get('category');

	const allProducts = await getAllProducts();

	const categories: Category[] = [...new Set(allProducts.map((p) => p.category))]
		.sort()
		.map((value) => ({ value, label: categoryLabel(value) }));

	const products = activeCategory ? await getProductsByCategory(activeCategory) : allProducts;

	return { products, categories, activeCategory };
};
