<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ProductCard from './ProductCard.svelte';

	const { Story } = defineMeta({
		title: 'ProductCard',
		component: ProductCard,
		tags: ['autodocs'],
		parameters: {
			backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#000000' }] }
		}
	});
</script>

<Story
	name="Shirt"
	args={{
		product: {
			id: 1,
			slug: 'mothman-shirt',
			name: 'Mothman Shirt',
			category: 'shirt',
			price: 25,
			description: null,
			sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
			colors: null
		}
	}}
/>

<Story
	name="Tape"
	args={{
		product: {
			id: 2,
			slug: 'attack-of-the-tape',
			name: 'Attack of the Tape',
			category: 'tape',
			price: 10,
			description: null,
			sizes: null,
			colors: null
		}
	}}
/>
