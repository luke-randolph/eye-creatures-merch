<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<section class="flex flex-col items-start gap-4">
	<h1 class="text-2xl font-bold tracking-wide">Checkout cancelled</h1>
	<p class="text-neutral-300">No worries — your cart is still waiting for you.</p>
	<a
		href={resolve('/cart')}
		class="rounded bg-white px-4 py-2 font-bold tracking-wide text-black hover:bg-neutral-200"
	>
		Back to cart
	</a>
</section>
