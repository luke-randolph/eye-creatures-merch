<script lang="ts">
	type Props = {
		sizes: string[];
		selected: string | null;
		onSelect: (size: string) => void;
	};

	let { sizes, selected, onSelect }: Props = $props();
</script>

<div class="flex flex-wrap gap-2" role="group" aria-label="Size">
	{#each sizes as size (size)}
		{@const isSelected = size === selected}
		<button
			type="button"
			onclick={() => onSelect(size)}
			aria-pressed={isSelected}
			class="min-w-10 rounded border px-3 py-1 text-sm font-medium transition {isSelected
				? 'border-white bg-white text-black'
				: 'border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'}"
		>
			{size}
		</button>
	{/each}
</div>
