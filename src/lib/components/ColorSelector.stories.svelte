<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ColorSelector from './ColorSelector.svelte';

	const { Story } = defineMeta({
		title: 'ColorSelector',
		component: ColorSelector,
		tags: ['autodocs'],
		parameters: {
			backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#000000' }] }
		}
	});
</script>

<script lang="ts">
	import type { ColorOption } from '$lib/types';

	const shirtColors: ColorOption[] = [
		{ hex: '#000000', label: 'Black', imageSlug: 'eye-creature-vs-city-shirt-black' },
		{ hex: '#01c48e', label: 'Green', imageSlug: 'eye-creature-vs-city-shirt-green' }
	];

	let selected = $state<ColorOption>(shirtColors[0]);
</script>

<Story name="Black and green">
	<ColorSelector colors={shirtColors} {selected} onSelect={(c) => (selected = c)} />
</Story>
