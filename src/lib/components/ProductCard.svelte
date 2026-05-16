<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Product } from '$lib/types';

	type Props = { product: Product };
	let { product }: Props = $props();
	let firstColor = $derived(product.colors?.[0]);
	let imageUrl = $derived(firstColor?.imageUrl ?? product.imageUrl);
	let imageSrcset = $derived(firstColor?.imageSrcset ?? product.imageSrcset);
</script>

<a
	href={resolve('/products/[slug]', { slug: product.slug })}
	class="group flex flex-col overflow-hidden rounded border border-neutral-800 bg-neutral-950 transition hover:border-neutral-600"
>
	<div class="aspect-square w-full overflow-hidden bg-neutral-900">
		<img
			src={imageUrl}
			srcset={imageSrcset}
			sizes="(min-width: 1024px) 262px, (min-width: 640px) 45vw, 92vw"
			alt={product.name}
			loading="lazy"
			width="800"
			height="800"
			class="h-full w-full object-cover transition group-hover:scale-105"
		/>
	</div>
	<div class="flex items-baseline justify-between gap-4 p-4">
		<h2 class="text-sm font-medium text-neutral-100">{product.name}</h2>
		<span class="text-sm text-neutral-400 tabular-nums">${product.price}</span>
	</div>
</a>
