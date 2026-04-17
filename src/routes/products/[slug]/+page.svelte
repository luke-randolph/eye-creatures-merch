<script lang="ts">
	import { resolve } from '$app/paths';
	import ColorSelector from '$lib/components/ColorSelector.svelte';
	import QuantitySelector from '$lib/components/QuantitySelector.svelte';
	import SizeSelector from '$lib/components/SizeSelector.svelte';
	import { getProductImage } from '$lib/productImages';
	import { cart } from '$lib/stores/cart.svelte';
	import type { ColorOption } from '$lib/types';
	import { ChevronLeft } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let product = $derived(data.product);

	let selectedColor = $state<ColorOption | null>(null);
	let selectedSize = $state<string | null>(null);
	let quantity = $state(1);
	let justAdded = $state(false);

	// Reset the selected color to the first option whenever the product changes.
	$effect(() => {
		selectedColor = product.colors?.[0] ?? null;
	});

	let imageSlug = $derived(selectedColor ? selectedColor.imageSlug : product.slug);
	let image = $derived(getProductImage(imageSlug));

	let needsSize = $derived(!!product.sizes && product.sizes.length > 0);
	let canAdd = $derived(!needsSize || selectedSize !== null);

	function addToCart() {
		if (!canAdd) return;
		cart.addItem(product, selectedSize, selectedColor, quantity);
		justAdded = true;
		setTimeout(() => (justAdded = false), 1500);
	}
</script>

<a
	href={resolve('/')}
	class="mb-6 inline-flex items-center gap-1 text-sm text-neutral-400 transition hover:text-white"
>
	<ChevronLeft class="h-4 w-4" aria-hidden="true" />
	Back
</a>

<div class="grid gap-8 md:grid-cols-2">
	<div class="overflow-hidden rounded border border-neutral-800 bg-neutral-950">
		{#if image}
			<enhanced:img src={image} alt={product.name} class="aspect-square w-full object-cover" />
		{/if}
	</div>

	<div class="flex flex-col gap-6">
		<div>
			<h1 class="text-3xl font-bold tracking-wide">{product.name}</h1>
			<p class="mt-2 text-xl text-neutral-300 tabular-nums">${product.price}</p>
		</div>

		{#if product.description}
			<p class="leading-relaxed text-neutral-300">{product.description}</p>
		{/if}

		{#if product.colors && product.colors.length > 0 && selectedColor}
			<div>
				<h2 class="mb-2 text-sm font-semibold tracking-wide text-neutral-400 uppercase">
					Color: {selectedColor.label}
				</h2>
				<ColorSelector
					colors={product.colors}
					selected={selectedColor}
					onSelect={(c) => (selectedColor = c)}
				/>
			</div>
		{/if}

		{#if needsSize && product.sizes}
			<div>
				<h2 class="mb-2 text-sm font-semibold tracking-wide text-neutral-400 uppercase">Size</h2>
				<SizeSelector
					sizes={product.sizes}
					selected={selectedSize}
					onSelect={(s) => (selectedSize = s)}
				/>
			</div>
		{/if}

		<div>
			<h2 class="mb-2 text-sm font-semibold tracking-wide text-neutral-400 uppercase">Quantity</h2>
			<QuantitySelector value={quantity} onChange={(n) => (quantity = n)} />
		</div>

		<button
			type="button"
			onclick={addToCart}
			disabled={!canAdd}
			class="w-full rounded bg-white px-6 py-3 font-bold tracking-wide text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
		>
			{justAdded ? 'Added to cart' : 'Add to cart'}
		</button>

		{#if needsSize && !selectedSize}
			<p class="text-sm text-neutral-500">Select a size to add to cart.</p>
		{/if}
	</div>
</div>
