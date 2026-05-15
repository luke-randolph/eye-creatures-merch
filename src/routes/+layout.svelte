<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();
</script>

<svelte:head>
	<title>Eye Creatures Merch</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<a
	href="#main-content"
	class="sr-only rounded bg-white px-4 py-2 font-bold text-black focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
>
	Skip to content
</a>
<div class="flex min-h-dvh flex-col">
	<Header user={data.user} />
	<main
		id="main-content"
		tabindex="-1"
		class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 focus:outline-none"
	>
		{@render children()}
	</main>
	<Footer />
</div>
