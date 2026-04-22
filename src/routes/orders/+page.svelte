<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatAmount(cents: number, currency: string) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency.toUpperCase()
		}).format(cents / 100);
	}

	function formatDate(date: Date | string) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function itemCount(items: (typeof data.orders)[number]['items']) {
		return items.reduce((sum, i) => sum + i.quantity, 0);
	}
</script>

<svelte:head>
	<title>My orders — Eye Creatures</title>
</svelte:head>

<h1 class="mb-6 text-2xl font-bold text-white">My orders</h1>

{#if data.orders.length === 0}
	<p class="text-neutral-400">
		You don't have any orders yet.
		<a href={resolve('/')} class="text-white underline hover:no-underline">Browse products →</a>
	</p>
{:else}
	<ul class="space-y-3">
		{#each data.orders as order (order.id)}
			<li>
				<a
					href={resolve(`/orders/${order.id}`)}
					class="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 px-4 py-3 transition hover:border-neutral-700 hover:bg-neutral-900"
				>
					<div>
						<p class="text-sm text-neutral-400">{formatDate(order.createdAt)}</p>
						<p class="mt-1 font-medium text-white">
							{itemCount(order.items)}
							{itemCount(order.items) === 1 ? 'item' : 'items'}
							<span class="ml-2 text-xs tracking-wide text-neutral-500 uppercase">
								{order.status}
							</span>
						</p>
					</div>
					<div class="text-right">
						<p class="font-medium text-white">
							{formatAmount(order.amountTotal, order.currency)}
						</p>
						<p class="text-xs text-neutral-500">View details →</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
{/if}
