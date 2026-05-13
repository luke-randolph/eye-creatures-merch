import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { emailOTP } from 'better-auth/plugins/email-otp';
import { eq, and, isNull } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/orders.schema';
import { sendOTPEmail } from '$lib/server/email';

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_ID) throw new Error('GOOGLE_CLIENT_ID is not set');
if (!GOOGLE_CLIENT_SECRET) throw new Error('GOOGLE_CLIENT_SECRET is not set');

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	socialProviders: {
		google: {
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		}
	},
	databaseHooks: {
		user: {
			create: {
				after: async (newUser) => {
					await db
						.update(orders)
						.set({ userId: newUser.id })
						.where(and(eq(orders.email, newUser.email), isNull(orders.userId)));
				}
			}
		}
	},
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp }) {
				await sendOTPEmail({ to: email, otp });
			}
		}),
		sveltekitCookies(getRequestEvent) // must remain last
	]
});
