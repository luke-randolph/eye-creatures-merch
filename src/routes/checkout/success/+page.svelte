<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { cart } from '$lib/stores/cart.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	onMount(() => {
		cart.clear();
	});

	const formatted = $derived(
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: data.currency
		}).format(data.amountTotal / 100)
	);
</script>

<section class="flex flex-col items-start gap-4">
	<h1 class="text-2xl font-bold tracking-wide">Thanks for your order!</h1>
	<p class="text-neutral-300">
		We've sent a receipt to <span class="text-white">{data.email ?? 'your email'}</span>.
	</p>
	<p class="text-neutral-300">
		Total charged: <span class="font-bold text-white tabular-nums">{formatted}</span>
	</p>

	<div class="flex flex-wrap gap-3 pt-2">
		<a
			href={resolve('/')}
			class="rounded bg-white px-4 py-2 font-bold tracking-wide text-black hover:bg-neutral-200"
		>
			Back to shop
		</a>
		{#if page.data.user}
			<a
				href={resolve('/orders')}
				class="rounded border border-neutral-700 px-4 py-2 font-bold tracking-wide text-white hover:bg-neutral-900"
			>
				View your orders
			</a>
		{:else}
			<a
				href={resolve('/sign-in?redirectTo=/orders')}
				class="rounded border border-neutral-700 px-4 py-2 font-bold tracking-wide text-white hover:bg-neutral-900"
			>
				Sign in to save your order history
			</a>
		{/if}
	</div>
</section>
