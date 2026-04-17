<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import QuantitySelector from './QuantitySelector.svelte';

	const { Story } = defineMeta({
		title: 'QuantitySelector',
		component: QuantitySelector,
		tags: ['autodocs'],
		parameters: {
			backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#000000' }] }
		}
	});
</script>

<script lang="ts">
	let defaultValue = $state(1);
	let fivePlusValue = $state(1);
</script>

<Story name="Default">
	<QuantitySelector value={defaultValue} onChange={(n) => (defaultValue = n)} />
</Story>

<Story name="Min 5">
	<QuantitySelector value={fivePlusValue} onChange={(n) => (fivePlusValue = n)} min={5} />
</Story>
