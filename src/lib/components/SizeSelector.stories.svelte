<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SizeSelector from './SizeSelector.svelte';

	const { Story } = defineMeta({
		title: 'SizeSelector',
		component: SizeSelector,
		tags: ['autodocs'],
		parameters: {
			backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#000000' }] }
		}
	});
</script>

<script lang="ts">
	let shirtSelected = $state<string | null>('M');
	let noneSelected = $state<string | null>(null);
</script>

<Story name="Shirt sizes">
	<SizeSelector
		sizes={['S', 'M', 'L', 'XL', '2XL', '3XL']}
		selected={shirtSelected}
		onSelect={(s) => (shirtSelected = s)}
	/>
</Story>

<Story name="None selected">
	<SizeSelector
		sizes={['S', 'M', 'L', 'XL']}
		selected={noneSelected}
		onSelect={(s) => (noneSelected = s)}
	/>
</Story>
