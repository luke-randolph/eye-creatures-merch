import { pgTable, serial, integer, text, varchar, jsonb } from 'drizzle-orm/pg-core';

export type ColorOption = { hex: string; label: string; imageSlug: string };

export const product = pgTable('product', {
	id: serial('id').primaryKey(),
	slug: varchar('slug', { length: 64 }).notNull().unique(),
	name: varchar('name', { length: 128 }).notNull(),
	category: varchar('category', { length: 32 }).notNull(),
	price: integer('price').notNull(),
	description: text('description'),
	sizes: jsonb('sizes').$type<string[] | null>(),
	colors: jsonb('colors').$type<ColorOption[] | null>()
});

export * from './auth.schema';
