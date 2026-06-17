# eye-creatures-merch

Merch storefront for the band **Eye Creatures**. Browse products, build a cart, and check out with a real card.

Built with SvelteKit 2 + Svelte 5 (runes), Tailwind v4, **Sanity** (product catalog), Drizzle ORM + Postgres (auth + orders), Better Auth (Google + email OTP), **Stripe Checkout**, Resend (transactional email), and Storybook.

## Architecture at a glance

Two sibling folders:

- **`eye-creatures-merch/`** (this repo) — the public storefront
- **`eye-creatures-sanity/`** — a standalone Sanity Studio app that manages the product catalog

Data sources:

- **Sanity** (cloud, project id `qvmho7ys`, dataset `production`) — the product catalog. The merch app fetches products over GROQ on each server load.
- **Postgres** (via Drizzle ORM) — Better Auth tables (users, sessions, accounts) **and** the `orders` table.

Checkout flow:

1. The cart lives in `localStorage` (`src/lib/stores/cart.svelte.ts`).
2. `POST /api/checkout` re-validates every line item against Sanity, creates a **Stripe Checkout Session**, and writes a `pending` order row keyed by the session id.
3. Stripe hosts the payment + shipping form and redirects to `/checkout/success` or `/checkout/cancel`.
4. `POST /api/stripe/webhook` verifies the signature and flips the order row to `paid` (on `checkout.session.completed`) or `expired` (on `checkout.session.expired`), filling in the authoritative total and shipping details.
5. Signed-in users see their `paid` orders at `/orders`; guest orders are linked to an account on first sign-in with a matching email.

## Prerequisites

- **Node.js** 24 or newer (matches `.nvmrc` and CI)
- **Docker Desktop** (running, for local Postgres via `compose.yaml`)
- **Git**
- A **Sanity account** with access to the `qvmho7ys` project (invite via [manage.sanity.io](https://manage.sanity.io))
- A **Stripe account** in test mode, and the [Stripe CLI](https://stripe.com/docs/stripe-cli) for forwarding webhooks locally

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable                                                 | Purpose                                                                                 |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                           | Postgres connection string (defaults to the Docker instance)                            |
| `ORIGIN`                                                 | App origin, e.g. `http://localhost:5173` — used by Better Auth and Stripe redirect URLs |
| `BETTER_AUTH_SECRET`                                     | Better Auth signing secret (32+ random chars in production)                             |
| `PUBLIC_SANITY_PROJECT_ID` / `_DATASET` / `_API_VERSION` | Sanity catalog connection                                                               |
| `STRIPE_SECRET_KEY`                                      | Stripe API key (use a test-mode key locally)                                            |
| `STRIPE_WEBHOOK_SECRET`                                  | Signing secret for the webhook endpoint (from `stripe listen`)                          |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`              | Google OAuth credentials for social sign-in                                             |
| `RESEND_API_KEY`                                         | Resend key for delivering OTP emails (optional in dev — see below)                      |
| `EMAIL_FROM`                                             | From-address for OTP emails                                                             |

> If `RESEND_API_KEY` is unset, OTP codes are logged to the server console instead of emailed — handy for local development.

## First-time setup

```sh
npm install
```

`npm install` also runs `prepare`, which:

- downloads Playwright browsers
- runs `svelte-kit sync` (generates `.svelte-kit/types`)
- installs the husky git hooks

Then, with Docker Desktop running:

```sh
npm run db:start    # terminal A — starts local Postgres, leave running
npm run db:push     # terminal B — creates auth + orders tables
npm run dev         # open the printed URL
```

To exercise checkout end to end, forward Stripe webhooks in another terminal:

```sh
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

Copy the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET`.

To edit products, run Studio in a separate terminal:

```sh
cd ../eye-creatures-sanity
npm install         # first time only
npm run dev         # opens http://localhost:3333
```

## Day-to-day scripts

| Command               | What it does                                          |
| --------------------- | ----------------------------------------------------- |
| `npm run dev`         | Start Vite dev server                                 |
| `npm run build`       | Production build                                      |
| `npm run preview`     | Preview the production build                          |
| `npm run check`       | Svelte + TypeScript type check                        |
| `npm run lint`        | Prettier (check) + ESLint                             |
| `npm run format`      | Prettier (write)                                      |
| `npm run test:e2e`    | Playwright end-to-end tests                           |
| `npm run storybook`   | Storybook dev server                                  |
| `npm run db:start`    | `docker compose up` (local Postgres)                  |
| `npm run db:push`     | Sync `schema.ts` to the DB (dev workflow — see below) |
| `npm run db:studio`   | Drizzle Studio (visual DB browser)                    |
| `npm run auth:schema` | Regenerate `auth.schema.ts` after editing `auth.ts`   |

The `db:*:prod` variants run the same Drizzle commands against `.env.production.local`.

## Content workflow (Sanity)

Products are managed through Sanity Studio, not the merch repo. Typical flow:

1. Run `npm run dev` inside `../eye-creatures-sanity/` → `http://localhost:3333`
2. Click **Product** in the left nav, then **+** to create a new product
3. Fill in name, slug (auto-generated from name), category, price, sizes, main image, optional color variants
4. Hit **Publish** — the storefront picks it up on next page load

The Studio can be deployed so bandmates can edit from anywhere:

```sh
cd ../eye-creatures-sanity
npx sanity deploy   # prompts for hostname, then serves at <hostname>.sanity.studio
```

Data access lives in `src/lib/server/sanity/products.ts` (`getAllProducts`, `getProductsByCategory`, `getProductBySlug`). Route loaders call these — don't write GROQ inline in `+page.server.ts` files.

## Database workflow

The Drizzle schema in `src/lib/server/db/` covers two areas:

- `auth.schema.ts` — Better Auth tables, generated by `npm run auth:schema`
- `orders.schema.ts` — the `orders` table, created at checkout and finalised by the Stripe webhook

Two workflows:

- **`db:push`** (dev) — direct schema sync. Re-run whenever a schema file changes.
- **`db:generate`** + **`db:migrate`** (production) — generates versioned SQL migration files into a `drizzle/` folder you commit, then applies pending ones. Switch to this before deploying so schema history is reviewable.

## Tests & CI

- **`npm run test:e2e`** runs Playwright specs (`*.e2e.ts`). `e2e/smoke.e2e.ts` is a dependency-free smoke test that boots a production build and checks core pages render.
- **GitHub Actions** (`.github/workflows/ci.yml`) runs type-check, lint, and the smoke e2e on every push and pull request to `main`.

## Pre-commit hook

Every commit runs `npx lint-staged && npm run check` via husky (`.husky/pre-commit`). `lint-staged` formats and lints staged files; `check` type-checks the project. If either fails, the commit is rejected. Bypass with `--no-verify` only when you really mean it.

## API endpoints

Both are internal — `/api/checkout` is called by the cart page, `/api/stripe/webhook` only by Stripe. Not a public API.

| Method & path              | Body → Response                                                                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/checkout`       | `{ items: [{ slug, size, colorHex, quantity (1–99) }] }` → `{ url }` (Stripe Checkout). Prices are recomputed server-side from Sanity. `400` on a bad or empty cart. |
| `POST /api/stripe/webhook` | Signature-verified Stripe event. `checkout.session.completed` → order `paid`, `checkout.session.expired` → `expired`. `400` on a bad signature.                      |

## Project layout

```
src/
├── app.html                            # Root HTML (dark theme applied here)
├── hooks.server.ts                     # Better Auth session handling
├── lib/
│   ├── auth-client.ts                  # Better Auth browser client
│   ├── categories.ts                   # Category value → label helpers
│   ├── sanityImage.ts                  # Sanity image URL builder
│   ├── types.ts                        # Client-safe Product / CartItem types
│   ├── components/                     # Header, Footer, ProfileMenu, ProductCard,
│   │                                   #   ColorSelector, SizeSelector, QuantitySelector
│   │                                   #   (+ co-located *.stories.svelte)
│   ├── server/
│   │   ├── auth.ts                     # Better Auth config (Google + email OTP)
│   │   ├── stripe.ts                   # Stripe client (server-only)
│   │   ├── email.ts                    # Resend OTP email
│   │   ├── db/                         # Drizzle client + auth/orders schemas
│   │   └── sanity/                     # Sanity client + product data access
│   └── stores/
│       └── cart.svelte.ts              # Runes-based cart (localStorage-persisted)
└── routes/
    ├── +layout.svelte                  # Header + main + Footer
    ├── +page.*                         # Product grid (homepage)
    ├── products/[slug]/                # Product detail page
    ├── cart/                           # Cart page
    ├── checkout/success · cancel/      # Post-Stripe landing pages
    ├── sign-in/                        # Google + email-OTP sign-in
    ├── orders/ · orders/[id]/          # Order history (auth-gated)
    └── api/
        ├── checkout/                   # Creates the Stripe Checkout Session
        └── stripe/webhook/             # Stripe webhook → writes orders
```

## Out of scope (not wired up yet)

- Server-side cart tied to a user account (the cart is still `localStorage` only)
- Real inventory / stock tracking
- Refunds and disputes — the webhook handles `checkout.session.completed` and `checkout.session.expired`, but not refund or dispute events
- A sweep to expire stale `pending` rows whose `checkout.session.expired` event was missed

## Useful links

- [SvelteKit docs](https://svelte.dev/docs/kit)
- [Svelte 5 runes](https://svelte.dev/docs/svelte/what-are-runes)
- [Sanity docs](https://www.sanity.io/docs) · [GROQ reference](https://www.sanity.io/docs/groq)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
