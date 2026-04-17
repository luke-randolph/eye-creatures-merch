<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Eye Creatures Merch</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />
<main class="mx-auto max-w-6xl px-4 py-8">
	{@render children()}
</main>
<Footer />
