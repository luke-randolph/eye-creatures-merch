# eye-creatures-merch

Merch storefront for the band **Eye Creatures**. Built with SvelteKit 2 + Svelte 5 (runes), Tailwind v4, Drizzle ORM + MySQL, Better Auth, and Storybook.

## Prerequisites

- **Node.js** 20+
- **Docker Desktop** (running, for local MySQL via `compose.yaml`)
- **Git**

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
npm run db:start    # terminal A — starts local MySQL, leave running
npm run db:push     # terminal B — creates tables from src/lib/server/db/schema.ts
npm run db:seed     # clears + seeds 5 products (2 shirts, tape, cd, sticker pack)
npm run dev         # open the printed URL
```

`.env` already has the local `DATABASE_URL` pointed at the Docker MySQL.

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
| `npm run db:start`    | `docker compose up` (local MySQL)                     |
| `npm run db:push`     | Sync `schema.ts` to the DB (dev workflow — see below) |
| `npm run db:studio`   | Drizzle Studio (visual DB browser)                    |
| `npm run db:seed`     | Clear + re-seed the product table                     |
| `npm run auth:schema` | Regenerate `auth.schema.ts` after editing `auth.ts`   |

## Database workflow

The schema lives in `src/lib/server/db/schema.ts`. Two workflows are supported:

- **`db:push`** (dev) — direct schema sync. Re-run whenever `schema.ts` changes (new table, new column, rename, drop, etc.). Fast, no migration files. Fine for local development.
- **`db:generate`** + **`db:migrate`** (production) — generates versioned SQL migration files into a `drizzle/` folder you commit to git, then applies pending ones. Switch to this before deploying so schema history is reviewable.

`db:seed` clears the `product` table then inserts the seed data, so it always leaves the DB in a known state. Safe to re-run any time during dev.

## Pre-commit hook

Every commit runs `npm run lint && npm run check` via husky (`.husky/pre-commit`). If either fails, the commit is rejected. Bypass with `--no-verify` only when you really mean it.

## Project layout

```
src/
├── app.html                         # Root HTML (dark theme applied here)
├── hooks.server.ts                  # Better Auth session handling
├── lib/
│   ├── assets/products/             # Product photos (build-time optimized via enhanced-img)
│   ├── components/                  # Header, ProductCard, QuantitySelector, SizeSelector
│   │                                #   (+ co-located .stories.svelte)
│   ├── productImages.ts             # slug → optimized Picture lookup
│   ├── server/
│   │   ├── auth.ts                  # Better Auth config
│   │   └── db/
│   │       ├── index.ts             # Drizzle client (`db`)
│   │       ├── schema.ts            # product + auth tables
│   │       └── seed.ts              # Seed script
│   ├── stores/
│   │   └── cart.svelte.ts           # Runes-based cart (localStorage-persisted)
│   └── types.ts                     # Client-safe Product / CartItem types
├── routes/
│   ├── +layout.svelte               # Header + main wrapper
│   ├── +page.server.ts / +page.svelte   # Product grid (homepage)
│   ├── products/[slug]/             # Product detail page
│   └── cart/                        # Cart page
└── stories/                         # Stock Storybook examples (can delete)
```

## Out of scope (not wired up yet)

- Payments / checkout — the "Checkout" button is a stub
- Persisted cart tied to user accounts (cart is `localStorage` only)
- Order table, order confirmation, account/order history
- Admin UI for managing products (use `db:studio`)
- Deployment to Vercel + a hosted MySQL

## Useful links

- [SvelteKit docs](https://svelte.dev/docs/kit)
- [Svelte 5 runes](https://svelte.dev/docs/svelte/what-are-runes)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)
