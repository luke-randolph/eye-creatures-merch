import type { ColorOption } from '$lib/types';

type ImageSource = { imageUrl: string; imageSrcset?: string };

export function resolveProductImage(base: ImageSource, color: ColorOption | null | undefined) {
	return {
		url: color?.imageUrl ?? base.imageUrl,
		srcset: color?.imageSrcset ?? base.imageSrcset
	};
}
