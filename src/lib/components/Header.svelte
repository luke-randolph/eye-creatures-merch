<script lang="ts">
	import { resolve } from '$app/paths';
	import { cart } from '$lib/stores/cart.svelte';
</script>

<header class="border-b border-neutral-800">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
		<a
			href={resolve('/')}
			class="text-lg font-bold tracking-widest text-white hover:text-neutral-300"
		>
			EYE CREATURES
		</a>
		<a
			href={resolve('/cart')}
			aria-label="Cart ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})"
			class="relative inline-flex items-center rounded p-2 text-neutral-200 hover:bg-neutral-900 hover:text-white"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-6 w-6"
				aria-hidden="true"
			>
				<path d="M3 3h2l2.4 12.6a2 2 0 0 0 2 1.4h9.2a2 2 0 0 0 2-1.6L22 8H6" />
				<circle cx="9" cy="21" r="1.3" />
				<circle cx="18" cy="21" r="1.3" />
			</svg>
			{#if cart.totalItems > 0}
				<span
					class="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-black tabular-nums"
				>
					{cart.totalItems}
				</span>
			{/if}
		</a>
	</div>
</header>
