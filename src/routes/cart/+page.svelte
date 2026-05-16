<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import QuantitySelector from '$lib/components/QuantitySelector.svelte';
	import { resolveProductImage } from '$lib/image';
	import { cart } from '$lib/stores/cart.svelte';
	import { X } from 'lucide-svelte';

	let checkoutPending = $state(false);
	let checkoutError = $state<string | null>(null);

	async function checkout() {
		checkoutError = null;
		checkoutPending = true;
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					items: cart.items.map((it) => ({
						productId: it.productId,
						slug: it.slug,
						size: it.size,
						colorHex: it.color?.hex ?? null,
						quantity: it.quantity
					}))
				})
			});
			if (!res.ok) {
				checkoutError = (await res.text()) || 'Checkout failed';
				return;
			}
			const { url } = (await res.json()) as { url: string };
			window.location.href = url;
		} catch {
			checkoutError = 'Network error — please try again';
		} finally {
			checkoutPending = false;
		}
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
				{@const imageUrl = resolveProductImage(item, item.color).url}
				{@const colorHex = item.color?.hex ?? null}
				<li class="flex flex-wrap items-start gap-4 py-4 sm:items-center">
					<a
						href={resolve('/products/[slug]', { slug: item.slug })}
						class="shrink-0 overflow-hidden rounded border border-neutral-800 bg-neutral-950"
					>
						<img
							src={imageUrl}
							alt={item.name}
							width="128"
							height="128"
							class="h-32 w-32 object-cover"
						/>
					</a>

					<div class="min-w-0 flex-1">
						<a
							href={resolve('/products/[slug]', { slug: item.slug })}
							class="text-sm font-medium hover:underline sm:text-base">{item.name}</a
						>
						{#if item.color}
							<p class="text-sm text-neutral-400 sm:text-base">Color: {item.color.label}</p>
						{/if}
						{#if item.size}
							<p class="text-sm text-neutral-400 sm:text-base">Size: {item.size}</p>
						{/if}
						<p class="mt-1 text-sm text-neutral-400 tabular-nums sm:text-base">
							${item.price} each
						</p>
					</div>

					<div
						class="flex flex-[0_0_100%] shrink-0 items-center justify-end gap-2 sm:flex-auto sm:gap-4"
					>
						<QuantitySelector
							value={item.quantity}
							onChange={(n) => cart.updateQuantity(item.productId, item.size, colorHex, n)}
						/>

						<div class="w-20 text-right tabular-nums">${item.price * item.quantity}</div>

						<button
							type="button"
							onclick={() => cart.removeItem(item.productId, item.size, colorHex)}
							aria-label="Remove {item.name} from cart"
							class="-mr-2 p-2 text-neutral-500 hover:text-white sm:mr-0"
						>
							<X class="h-5 w-5" aria-hidden="true" />
						</button>
					</div>
				</li>
			{/each}
		</ul>

		<div class="flex items-center justify-between pt-6">
			<span class="text-lg text-neutral-400">Subtotal</span>
			<span class="text-2xl font-bold tabular-nums">${cart.subtotal}</span>
		</div>

		<div class="flex flex-col items-end gap-2">
			{#if checkoutError}
				<p class="text-sm text-red-400">{checkoutError}</p>
			{/if}
			<Button size="lg" onclick={checkout} disabled={checkoutPending}>
				{checkoutPending ? 'Redirecting…' : 'Checkout'}
			</Button>
		</div>
	{/if}
</section>
