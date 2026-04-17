<script lang="ts">
	import { resolve } from '$app/paths';
	// import greenFacesBanner from '$lib/assets/banners/green-faces.png?enhanced';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section>
	<h1 class="mb-6 text-2xl font-bold tracking-wide">Eye Creatures Merch</h1>
	<!-- <enhanced:img
		src={greenFacesBanner}
		alt=""
		aria-hidden="true"
		class="mb-8 w-full rounded border border-neutral-800 object-cover"
	/> -->
	<div class="mb-8 flex flex-wrap justify-end gap-2" role="group" aria-label="Filter by category">
		<a
			href={resolve('/')}
			aria-current={data.activeCategory === null ? 'page' : undefined}
			class="rounded-full border px-4 py-1 text-sm transition {data.activeCategory === null
				? 'border-white bg-white text-black'
				: 'border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'}"
		>
			All
		</a>
		{#each data.categories as category (category.value)}
			{@const isActive = data.activeCategory === category.value}
			<a
				href="{resolve('/')}?category={category.value}"
				aria-current={isActive ? 'page' : undefined}
				class="rounded-full border px-4 py-1 text-sm transition {isActive
					? 'border-white bg-white text-black'
					: 'border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'}"
			>
				{category.label}
			</a>
		{/each}
	</div>

	{#if data.products.length === 0}
		<p class="text-neutral-400">No products in this category yet.</p>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each data.products as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>
	{/if}
</section>
