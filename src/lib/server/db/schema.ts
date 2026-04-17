import { mysqlTable, serial, int, text, varchar, json } from 'drizzle-orm/mysql-core';

export const product = mysqlTable('product', {
	id: serial('id').primaryKey(),
	slug: varchar('slug', { length: 64 }).notNull().unique(),
	name: varchar('name', { length: 128 }).notNull(),
	price: int('price').notNull(),
	description: text('description'),
	image: varchar('image', { length: 255 }).notNull(),
	sizes: json('sizes').$type<string[] | null>()
});

export * from './auth.schema';
