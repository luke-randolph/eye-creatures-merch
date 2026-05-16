<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
</script>

<section class="flex flex-col items-start gap-4">
	<h1 class="text-2xl font-bold tracking-wide">Checkout cancelled</h1>
	<p class="text-neutral-300">No worries — your cart is still waiting for you.</p>
	<Button href={resolve('/cart')}>Back to cart</Button>
</section>
