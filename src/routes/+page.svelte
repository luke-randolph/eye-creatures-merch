<script lang="ts">
	// import greenFacesBanner from '$lib/assets/banners/green-faces.png?enhanced';
	import CategoryFilter from '$lib/components/CategoryFilter.svelte';
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
	<CategoryFilter categories={data.categories} activeCategory={data.activeCategory} />

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
