# NOVA — Creator Business Platform

NOVA is a creator monetization platform: a public marketing site plus an
authenticated dashboard that brings a creator's content, audience,
sponsorships, store and revenue into one place instead of six different
platform dashboards.

Dark editorial visual system (near-black background, lime accent, large
Space Grotesk display type, minimal borders) carried consistently across
the public site and the product itself.

## Tech stack

- **React 19** + **Vite** + **React Router v7** (`HashRouter`)
- **Tailwind CSS v4** (`@tailwindcss/vite`, tokens defined in `src/index.css`'s `@theme` block)
- **oxlint** for linting
- No backend: the entire app runs against realistic mock data (see [Demo data](#demo-data-vs-live-data) below)

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

## Project structure

```
src/
  pages/              Top-level routed pages (HomePage, CreatorProfilePage)
  components/         Public marketing site sections (Hero, Nav, landing/*)
  components/profile  Public creator profile (/creator/:username) sections
  dashboard/          Authenticated app: sidebar, topbar, every dashboard page
  onboarding/         5-step first-run onboarding flow (/onboarding)
  data/               Single source of truth for all mock data - every
                      number shown anywhere in the app is derived from here,
                      never hardcoded in a component
  integrations/       Mock provider adapters (youtube/twitch/tiktok/
                      instagram/discord/shopify/stripe) - the eventual real
                      API boundary, see below
  hooks/              Shared hooks (scroll-reveal, click-outside, etc.)
```

## Routes

**Public site** (marketing, no auth):
- `/` — homepage
- `/creator/:username` — public creator profile (media kit CTA, merch, socials)
- `/onboarding` — first-run setup wizard, ends at `/dashboard`

**Product** (dashboard, shares one sidebar/topbar shell):
`/dashboard`, `/analytics`, `/audience`, `/revenue`, `/sponsorships`
(Brand Deals), `/shop` (Store), `/community`, `/content-planner`,
`/insights`, `/media-kit`, `/integrations`, `/settings`.

Routes not yet built (`/community`, `/settings`) render a `ComingSoon`
placeholder rather than a broken page or dead link.

## Demo data vs. live data

Every number in the product — revenue, followers, sponsorship deals,
notifications — is realistic mock data, generated deterministically from
`src/data/*.js`. This is intentional and always visible:

- A **"DEMO MODE"** badge sits in the dashboard topbar on every page.
- The sidebar identifies the account as a **"Sample Workspace"**.
- `src/data/connections.js` models three real connection states per
  provider (`connected` / `needs_attention` / `not_connected`) so the UI
  already demonstrates what a disconnected or expired connection looks like
  (see the Integrations and Audience pages) without pretending any of it is
  a live account.

### Where a real integration plugs in

`src/integrations/<provider>/index.js` (one file per platform) is the
adapter boundary. Every adapter exports the same shape — `getConnectionStatus()`
plus a few async data methods — and every method already resolves from
`src/data/*.js` after a simulated network delay (`mockDelay()`). A real
integration means rewriting the *inside* of these functions to call the
provider's actual API (OAuth, pagination, rate limits); every call site
already `await`s these functions, so no page changes when that happens.

## Design system

Tokens live in `src/index.css`'s `@theme` block (`--color-bg`, `--color-accent`,
etc.) and generate Tailwind utilities directly (`bg-accent`, `text-muted`, …).
Shared primitives (`IconChip`, `Sparkline`, `StatusBadge`, `EmptyState`,
`CategoryBarList`, charts) live in `src/dashboard/` and are reused across
every dashboard page and several landing sections, so the product reads as
one system rather than one-off pages.

## Responsive behavior

Every page is designed mobile-first with intentional recomposition, not
naive shrinking: the sidebar becomes a slide-over menu, data tables become
stacked cards (Brand Deals, Store, Sponsorships), and the Content Planner's
week view stacks into a single column.

---

`docs/design-handoff/` contains the original Claude Design handoff bundle
(chat transcripts and HTML prototypes) this product was built from. It's
historical reference, not part of the running app.
