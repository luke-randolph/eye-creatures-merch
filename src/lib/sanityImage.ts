import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';

const builder = createImageUrlBuilder({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET
});

export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}

export function productImageUrl(source: SanityImageSource, width = 800) {
	return urlFor(source).width(width).auto('format').fit('max').url();
}

export function productImageSrcset(source: SanityImageSource, widths: number[] = [400, 800, 1200]) {
	return widths
		.map((w) => `${urlFor(source).width(w).auto('format').fit('max').url()} ${w}w`)
		.join(', ');
}
