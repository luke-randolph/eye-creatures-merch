<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let order = $derived(data.order);

	function formatAmount(cents: number, currency: string) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency.toUpperCase()
		}).format(cents / 100);
	}

	function formatDate(date: Date | string) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Order details — Eye Creatures</title>
</svelte:head>

<div class="mb-6">
	<a href={resolve('/orders')} class="text-sm text-neutral-400 hover:text-white"> ← All orders </a>
</div>

<div class="mb-6 flex items-baseline justify-between">
	<div>
		<h1 class="text-2xl font-bold text-white">Order</h1>
		<p class="mt-1 text-sm text-neutral-400">
			Placed {formatDate(order.createdAt)} ·
			<span class="tracking-wide uppercase">{order.status}</span>
		</p>
	</div>
	<p class="text-xl font-semibold text-white">
		{formatAmount(order.amountTotal, order.currency)}
	</p>
</div>

<section class="mb-8">
	<h2 class="mb-3 text-sm font-semibold tracking-wide text-neutral-400 uppercase">Items</h2>
	<ul class="divide-y divide-neutral-800 rounded-md border border-neutral-800 bg-neutral-950">
		{#each order.items as item, i (i)}
			<li class="flex items-center justify-between px-4 py-3">
				<div>
					<p class="font-medium text-white">{item.name}</p>
					<p class="text-sm text-neutral-400">
						{#if item.colorLabel}{item.colorLabel}{/if}
						{#if item.colorLabel && item.size}
							·
						{/if}
						{#if item.size}{item.size}{/if}
						{#if item.colorLabel || item.size}
							·
						{/if}
						Qty {item.quantity}
					</p>
				</div>
				<p class="text-white">
					{formatAmount(item.unitAmount * item.quantity, order.currency)}
				</p>
			</li>
		{/each}
	</ul>
</section>

{#if order.shippingAddress}
	<section class="mb-8">
		<h2 class="mb-3 text-sm font-semibold tracking-wide text-neutral-400 uppercase">Shipping to</h2>
		<address class="text-sm text-neutral-200 not-italic">
			{#if order.shippingName}<p>{order.shippingName}</p>{/if}
			{#if order.shippingAddress.line1}<p>{order.shippingAddress.line1}</p>{/if}
			{#if order.shippingAddress.line2}<p>{order.shippingAddress.line2}</p>{/if}
			<p>
				{order.shippingAddress.city ?? ''}{order.shippingAddress.city && order.shippingAddress.state
					? ', '
					: ''}{order.shippingAddress.state ?? ''}
				{order.shippingAddress.postalCode ?? ''}
			</p>
			{#if order.shippingAddress.country}<p>{order.shippingAddress.country}</p>{/if}
		</address>
	</section>
{/if}

<p class="text-xs text-neutral-400">Order ID: {order.id}</p>
