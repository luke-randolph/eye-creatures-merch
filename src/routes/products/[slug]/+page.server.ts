import { getProductBySlug } from '$lib/server/sanity/products';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const product = await getProductBySlug(params.slug);

	if (!product) {
		error(404, 'Product not found');
	}

	return { product };
};
