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
			slug: 'shirt',
			name: 'Eye Creatures Shirt',
			price: 25,
			description: 'Heavyweight black tee.',
			image: '/products/shirt.svg',
			sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
		}
	}}
/>

<Story
	name="Tape"
	args={{
		product: {
			id: 2,
			slug: 'tape',
			name: 'Debut Cassette',
			price: 10,
			description: null,
			image: '/products/tape.svg',
			sizes: null
		}
	}}
/>
