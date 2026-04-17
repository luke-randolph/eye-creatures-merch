<script lang="ts">
	import type { ColorOption } from '$lib/types';

	type Props = {
		colors: ColorOption[];
		selected: ColorOption;
		onSelect: (color: ColorOption) => void;
	};

	let { colors, selected, onSelect }: Props = $props();
</script>

<div class="flex flex-wrap gap-3" role="group" aria-label="Color">
	{#each colors as color (color.hex)}
		{@const isSelected = color.hex === selected.hex}
		<button
			type="button"
			onclick={() => onSelect(color)}
			aria-pressed={isSelected}
			aria-label={color.label}
			title={color.label}
			class="h-8 w-8 rounded-sm border border-white transition {isSelected
				? 'ring-2 ring-white ring-offset-2 ring-offset-black'
				: 'hover:ring-1 hover:ring-neutral-400 hover:ring-offset-2 hover:ring-offset-black'}"
			style="background-color: {color.hex};"
		></button>
	{/each}
</div>
