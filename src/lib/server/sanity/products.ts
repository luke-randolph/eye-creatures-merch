import { productImageUrl } from '$lib/sanityImage';
import type { Product } from '$lib/types';
import type { SanityImageSource } from '@sanity/image-url';
import { sanity } from './client';

type ProductDoc = {
	id: string;
	slug: string;
	name: string;
	category: string;
	price: number;
	description: string | null;
	sizes: string[] | null;
	mainImage: SanityImageSource;
	colors: { hex: string; label: string; image: SanityImageSource }[] | null;
};

const PROJECTION = `{
	"id": _id,
	"slug": slug.current,
	name,
	category,
	price,
	description,
	sizes,
	mainImage,
	colors[]{ hex, label, image }
}`;

function toProduct(doc: ProductDoc): Product {
	return {
		id: doc.id,
		slug: doc.slug,
		name: doc.name,
		category: doc.category,
		price: doc.price,
		description: doc.description,
		sizes: doc.sizes,
		imageUrl: productImageUrl(doc.mainImage),
		colors:
			doc.colors?.map((c) => ({
				hex: c.hex,
				label: c.label,
				imageUrl: productImageUrl(c.image)
			})) ?? null
	};
}

export async function getAllProducts(): Promise<Product[]> {
	const docs = await sanity.fetch<ProductDoc[]>(
		`*[_type == "product"] | order(_createdAt asc) ${PROJECTION}`
	);
	return docs.map(toProduct);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
	const docs = await sanity.fetch<ProductDoc[]>(
		`*[_type == "product" && category == $category] | order(_createdAt asc) ${PROJECTION}`,
		{ category }
	);
	return docs.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
	const doc = await sanity.fetch<ProductDoc | null>(
		`*[_type == "product" && slug.current == $slug][0] ${PROJECTION}`,
		{ slug }
	);
	return doc ? toProduct(doc) : null;
}
