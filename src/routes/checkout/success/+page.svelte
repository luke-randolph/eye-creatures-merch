<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import { formatAmount } from '$lib/format';
	import { cart } from '$lib/stores/cart.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	onMount(() => {
		cart.clear();
	});

	const formatted = $derived(formatAmount(data.amountTotal, data.currency));
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
		<Button href={resolve('/')}>Back to shop</Button>
		{#if page.data.user}
			<Button href={resolve('/orders')} variant="outline">View your orders</Button>
		{:else}
			<Button href={resolve('/sign-in?redirectTo=/orders')} variant="outline">
				Sign in to save your order history
			</Button>
		{/if}
	</div>
</section>
