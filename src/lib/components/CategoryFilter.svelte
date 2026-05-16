<script lang="ts">
	import { resolve } from '$app/paths';
	import { pillClass } from '$lib/styles';
	import type { Category } from '$lib/types';

	type Props = {
		categories: Category[];
		activeCategory: string | null;
	};

	let { categories, activeCategory }: Props = $props();
</script>

<div class="mb-8 flex flex-wrap justify-end gap-2" role="group" aria-label="Filter by category">
	<a
		href={resolve('/')}
		aria-current={activeCategory === null ? 'page' : undefined}
		class="rounded-full border px-4 py-1 text-sm transition {pillClass(activeCategory === null)}"
	>
		All
	</a>
	{#each categories as category (category.value)}
		{@const isActive = activeCategory === category.value}
		<a
			href="{resolve('/')}?category={category.value}"
			aria-current={isActive ? 'page' : undefined}
			class="rounded-full border px-4 py-1 text-sm transition {pillClass(isActive)}"
		>
			{category.label}
		</a>
	{/each}
</div>
