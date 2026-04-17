<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section>
	<h1 class="mb-6 text-2xl font-bold tracking-wide">Merch</h1>
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		{#each data.products as product (product.id)}
			<ProductCard {product} />
		{/each}
	</div>
</section>
