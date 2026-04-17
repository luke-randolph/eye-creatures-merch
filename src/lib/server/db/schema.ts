import { mysqlTable, serial, int, text, varchar, json } from 'drizzle-orm/mysql-core';

export type ColorOption = { hex: string; label: string; imageSlug: string };

export const product = mysqlTable('product', {
	id: serial('id').primaryKey(),
	slug: varchar('slug', { length: 64 }).notNull().unique(),
	name: varchar('name', { length: 128 }).notNull(),
	category: varchar('category', { length: 32 }).notNull(),
	price: int('price').notNull(),
	description: text('description'),
	sizes: json('sizes').$type<string[] | null>(),
	colors: json('colors').$type<ColorOption[] | null>()
});

export * from './auth.schema';
