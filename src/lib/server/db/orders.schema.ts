import { pgTable, varchar, text, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export type OrderItemSnapshot = {
	productId: string;
	slug: string;
	name: string;
	size: string | null;
	colorHex: string | null;
	colorLabel: string | null;
	quantity: number;
	unitAmount: number;
};

export type ShippingAddressSnapshot = {
	line1: string | null;
	line2: string | null;
	city: string | null;
	state: string | null;
	postalCode: string | null;
	country: string | null;
};

export const orders = pgTable(
	'orders',
	{
		id: varchar('id', { length: 36 }).primaryKey(),
		stripeSessionId: varchar('stripe_session_id', { length: 255 }).notNull().unique(),
		stripePaymentIntentId: text('stripe_payment_intent_id'),
		email: varchar('email', { length: 255 }).notNull(),
		amountTotal: integer('amount_total').notNull(),
		currency: varchar('currency', { length: 3 }).notNull(),
		status: varchar('status', { length: 32 }).notNull(),
		items: jsonb('items').$type<OrderItemSnapshot[]>().notNull(),
		shippingName: text('shipping_name'),
		shippingAddress: jsonb('shipping_address').$type<ShippingAddressSnapshot | null>(),
		userId: varchar('user_id', { length: 36 }).references(() => user.id, { onDelete: 'set null' }),
		createdAt: timestamp('created_at', { precision: 3 }).defaultNow().notNull()
	},
	(table) => [index('orders_user_id_idx').on(table.userId)]
);
