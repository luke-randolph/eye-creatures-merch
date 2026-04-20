# eye-creatures-merch

Merch storefront for the band **Eye Creatures**. Built with SvelteKit 2 + Svelte 5 (runes), Tailwind v4, **Sanity** (product catalog), Drizzle ORM + Postgres (auth only), Better Auth, and Storybook.

## Architecture at a glance

Two sibling folders:

- **`eye-creatures-merch/`** (this repo) — the public storefront
- **`eye-creatures-sanity/`** — a standalone Sanity Studio app that manages the product catalog

Products live in Sanity's cloud (project id `qvmho7ys`, dataset `production`). The merch app fetches them over GROQ on each server load. The Drizzle/Postgres DB only powers Better Auth tables.

## Prerequisites

- **Node.js** 20+
- **Docker Desktop** (running, for local Postgres via `compose.yaml`)
- **Git**
- A **Sanity account** with access to the `qvmho7ys` project (invite via [manage.sanity.io](https://manage.sanity.io))

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
npm run db:push     # terminal B — creates auth tables from src/lib/server/db/schema.ts
npm run dev         # open the printed URL
```

`.env` has `DATABASE_URL` pointed at the Docker Postgres, plus the `PUBLIC_SANITY_*` vars pointing at the production Sanity dataset.

To edit products, run Studio in a separate terminal:

```sh
cd ../eye-creatures-sanity
npm install         # first time only
npm run dev         # opens http://localhost:3333
```

## Day-to-day scripts

| Command               | What it does                                              |
| --------------------- | --------------------------------------------------------- |
| `npm run dev`         | Start Vite dev server                                     |
| `npm run build`       | Production build                                          |
| `npm run preview`     | Preview the production build                              |
| `npm run check`       | Svelte + TypeScript type check                            |
| `npm run lint`        | Prettier (check) + ESLint                                 |
| `npm run format`      | Prettier (write)                                          |
| `npm run test:e2e`    | Playwright end-to-end tests                               |
| `npm run storybook`   | Storybook dev server                                      |
| `npm run db:start`    | `docker compose up` (local Postgres)                      |
| `npm run db:push`     | Sync `schema.ts` to the DB (dev workflow — see below)     |
| `npm run db:studio`   | Drizzle Studio (visual DB browser for auth tables)        |
| `npm run auth:schema` | Regenerate `auth.schema.ts` after editing `auth.ts`       |

## Content workflow (Sanity)

Products are managed through Sanity Studio, not the merch repo. Typical flow:

1. Run `npm run dev` inside `../eye-creatures-sanity/` → `http://localhost:3333`
2. Click **Product** in the left nav, then **+** to create a new product
3. Fill in name, slug (auto-generated from name), category, price, sizes, main image, optional color variants
4. Hit **Publish** — the storefront picks it up on next page load (Sanity CDN cache is near-instant)

The Studio can be deployed so bandmates can edit from anywhere:

```sh
cd ../eye-creatures-sanity
npx sanity deploy   # prompts for hostname, then serves at <hostname>.sanity.studio
```

Data access lives in `src/lib/server/sanity/products.ts` (`getAllProducts`, `getProductsByCategory`, `getProductBySlug`). Route loaders call these — don't write GROQ inline in `+page.server.ts` files.

## Database workflow

The Drizzle schema in `src/lib/server/db/schema.ts` only covers Better Auth tables now. Two workflows:

- **`db:push`** (dev) — direct schema sync. Re-run whenever `schema.ts` changes.
- **`db:generate`** + **`db:migrate`** (production) — generates versioned SQL migration files into a `drizzle/` folder you commit, then applies pending ones. Switch to this before deploying so schema history is reviewable.

## Pre-commit hook

Every commit runs `npm run lint && npm run check` via husky (`.husky/pre-commit`). If either fails, the commit is rejected. Bypass with `--no-verify` only when you really mean it.

## Project layout

```
src/
├── app.html                            # Root HTML (dark theme applied here)
├── hooks.server.ts                     # Better Auth session handling
├── lib/
│   ├── assets/products/                # Product photos — used by Storybook stories only
│   │                                   #   (storefront images come from Sanity's CDN)
│   ├── components/                     # Header, ProductCard, QuantitySelector, SizeSelector
│   │                                   #   (+ co-located .stories.svelte)
│   ├── sanityImage.ts                  # Client-safe image URL builder (urlFor, productImageUrl)
│   ├── server/
│   │   ├── auth.ts                     # Better Auth config
│   │   ├── db/
│   │   │   ├── index.ts                # Drizzle client (`db`) — auth tables only
│   │   │   └── schema.ts               # re-exports auth.schema.ts
│   │   └── sanity/
│   │       ├── client.ts               # Sanity client (server-only)
│   │       └── products.ts             # Data access: getAllProducts, getProductBySlug, etc.
│   ├── stores/
│   │   └── cart.svelte.ts              # Runes-based cart (localStorage-persisted)
│   └── types.ts                        # Client-safe Product / CartItem types
└── routes/
    ├── +layout.svelte                  # Header + main wrapper
    ├── +page.server.ts / +page.svelte  # Product grid (homepage)
    ├── products/[slug]/                # Product detail page
    └── cart/                           # Cart page
```

## Out of scope (not wired up yet)

- Payments / checkout — the "Checkout" button is a stub
- Persisted cart tied to user accounts (cart is `localStorage` only)
- Order table, order confirmation, account/order history
- Real inventory tracking (would need a commerce layer like Stripe or Shopify)
- Deployment to Vercel + a hosted Postgres for auth

## Useful links

- [SvelteKit docs](https://svelte.dev/docs/kit)
- [Svelte 5 runes](https://svelte.dev/docs/svelte/what-are-runes)
- [Sanity docs](https://www.sanity.io/docs) · [GROQ reference](https://www.sanity.io/docs/groq)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)
