import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { product } from './schema';

const seedProducts = [
	{
		slug: 'mothman-shirt',
		name: 'Mothman Shirt',
		category: 'shirt',
		price: 25,
		description: null,
		sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
		colors: null
	},
	{
		slug: 'eye-creature-vs-city-shirt',
		name: 'Eye Creature vs City Shirt',
		category: 'shirt',
		price: 25,
		description: null,
		sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
		colors: [
			{ hex: '#000000', label: 'Black', imageSlug: 'eye-creature-vs-city-shirt-black' },
			{ hex: '#01c48e', label: 'Green', imageSlug: 'eye-creature-vs-city-shirt-green' }
		]
	},
	{
		slug: 'attack-of-the-tape',
		name: 'Attack of the Tape',
		category: 'tape',
		price: 10,
		description: null,
		sizes: null,
		colors: null
	},
	{
		slug: 'insert-disc-2-cd',
		name: 'Insert Disc 2 CD',
		category: 'cd',
		price: 12,
		description: null,
		sizes: null,
		colors: null
	},
	{
		slug: 'sticker-pack',
		name: 'Sticker Pack',
		category: 'stickers',
		price: 5,
		description: null,
		sizes: null,
		colors: null
	}
];

async function main() {
	const url = process.env.DATABASE_URL;
	if (!url) throw new Error('DATABASE_URL is not set');

	const client = await mysql.createConnection(url);
	const db = drizzle(client, { mode: 'default' });

	await db.delete(product);
	console.log('cleared existing products');

	for (const p of seedProducts) {
		await db.insert(product).values(p);
		console.log(`seeded ${p.slug}`);
	}

	await client.end();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
