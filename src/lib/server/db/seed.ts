import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { product } from './schema';

const seedProducts = [
	{
		slug: 'shirt',
		name: 'Eye Creatures Shirt',
		price: 25,
		description: 'Heavyweight black tee with the Eye Creatures logo printed on the front.',
		image: '/products/shirt.svg',
		sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
	},
	{
		slug: 'tape',
		name: 'Debut Cassette',
		price: 10,
		description: 'Limited-run cassette tape of the debut album. Includes digital download code.',
		image: '/products/tape.svg',
		sizes: null
	},
	{
		slug: 'cd',
		name: 'Debut CD',
		price: 12,
		description: 'Compact disc pressing of the debut album in a gatefold sleeve.',
		image: '/products/cd.svg',
		sizes: null
	},
	{
		slug: 'stickers',
		name: 'Sticker Pack',
		price: 5,
		description: 'Five vinyl stickers featuring assorted Eye Creatures artwork.',
		image: '/products/stickers.svg',
		sizes: null
	}
];

async function main() {
	const url = process.env.DATABASE_URL;
	if (!url) throw new Error('DATABASE_URL is not set');

	const client = await mysql.createConnection(url);
	const db = drizzle(client, { mode: 'default' });

	for (const p of seedProducts) {
		await db
			.insert(product)
			.values(p)
			.onDuplicateKeyUpdate({
				set: {
					name: p.name,
					price: p.price,
					description: p.description,
					image: p.image,
					sizes: p.sizes
				}
			});
		console.log(`seeded ${p.slug}`);
	}

	await client.end();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
