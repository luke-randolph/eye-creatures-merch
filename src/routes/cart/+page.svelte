<script lang="ts">
	import { resolve } from '$app/paths';
	import QuantitySelector from '$lib/components/QuantitySelector.svelte';
	import { getProductImage } from '$lib/productImages';
	import { cart } from '$lib/stores/cart.svelte';
	import { X } from 'lucide-svelte';

	function checkout() {
		alert('Checkout is not wired up yet.');
	}
</script>

<section class="flex flex-col gap-6">
	<h1 class="text-2xl font-bold tracking-wide">Cart</h1>

	{#if cart.items.length === 0}
		<p class="text-neutral-400">
			Your cart is empty. <a class="underline hover:text-white" href={resolve('/')}>Browse merch</a
			>.
		</p>
	{:else}
		<ul class="flex flex-col divide-y divide-neutral-800 border-y border-neutral-800">
			{#each cart.items as item (item.productId + ':' + (item.size ?? '') + ':' + (item.color?.hex ?? ''))}
				{@const image = getProductImage(item.color?.imageSlug ?? item.slug)}
				{@const colorHex = item.color?.hex ?? null}
				<li class="flex items-center gap-4 py-4">
					<a
						href={resolve('/products/[slug]', { slug: item.slug })}
						class="shrink-0 overflow-hidden rounded border border-neutral-800 bg-neutral-950"
					>
						{#if image}
							<enhanced:img src={image} alt={item.name} class="h-20 w-20 object-cover" />
						{/if}
					</a>

					<div class="min-w-0 flex-1">
						<a
							href={resolve('/products/[slug]', { slug: item.slug })}
							class="font-medium hover:underline">{item.name}</a
						>
						{#if item.color}
							<p class="text-sm text-neutral-400">Color: {item.color.label}</p>
						{/if}
						{#if item.size}
							<p class="text-sm text-neutral-400">Size: {item.size}</p>
						{/if}
						<p class="mt-1 text-sm text-neutral-400 tabular-nums">${item.price} each</p>
					</div>

					<QuantitySelector
						value={item.quantity}
						onChange={(n) => cart.updateQuantity(item.productId, item.size, colorHex, n)}
					/>

					<div class="w-20 text-right tabular-nums">${item.price * item.quantity}</div>

					<button
						type="button"
						onclick={() => cart.removeItem(item.productId, item.size, colorHex)}
						aria-label="Remove {item.name} from cart"
						class="p-2 text-neutral-500 hover:text-white"
					>
						<X class="h-5 w-5" aria-hidden="true" />
					</button>
				</li>
			{/each}
		</ul>

		<div class="flex items-center justify-between pt-6">
			<span class="text-lg text-neutral-400">Subtotal</span>
			<span class="text-2xl font-bold tabular-nums">${cart.subtotal}</span>
		</div>

		<div class="flex justify-end">
			<button
				type="button"
				onclick={checkout}
				class="rounded bg-white px-6 py-3 font-bold tracking-wide text-black hover:bg-neutral-200"
			>
				Checkout
			</button>
		</div>
	{/if}
</section>
