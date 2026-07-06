# grundstock-frontend

Website for **Grundstock 2026** — the festival from friends for friends, from Regensburg
for Regensburg (13.–16. August 2026, Vilswörth), run by the gemeinnütziger Verein
[Neues Brett e.V.](https://neues-brett.de)

TanStack Start (SSR) on Cloudflare Workers · React 19 + React Compiler · TanStack
Router/Query · Tailwind v4 · Paraglide i18n (de, en-ready) · Sanity CMS · Biome · Vitest

## Quickstart

```bash
pnpm install    # also compiles i18n messages (prepare hook)
pnpm dev        # http://localhost:3000
```

Content comes from the Sanity studio in [`../grundstock-cms`](../grundstock-cms) —
published documents appear on the site without a rebuild. With an empty dataset every
page renders a sensible empty state, so the frontend runs standalone.

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server on :3000 |
| `pnpm typecheck && pnpm check` | Verify types + lint/format (run before pushing) |
| `pnpm test` | Vitest, single run |
| `pnpm build` | Production build (Worker + assets) |
| `pnpm deploy` | Build + deploy to Cloudflare — manual only |

## Where things live

- **Architecture, conventions, commands** → [`CLAUDE.md`](CLAUDE.md)
- **Full project plan** (design, content model, SEO/privacy decisions, phases, launch
  checklist) → [`docs/PLAN.md`](docs/PLAN.md)
- Features (data + UI per domain) → `src/features/<domain>/{api,components,types.ts}`
- Routes (thin: loader + one feature component) → `src/routes/`
- Sanity client + zod boundary helpers → `src/lib/sanity.ts`
- Interim site constants (URLs, dates — CMS-bound) → `src/lib/site.ts`
- UI strings → `messages/de.json` + `messages/en.json` (Paraglide; German is the base
  locale, English ships later under `/en`)

## Principles

- **Dark-only** night-jungle theme — tokens in `src/styles.css`.
- **No cookie banner by design**: self-hosted fonts/assets, YouTube only via
  click-to-load facade, cookieless analytics.
- **Zero-cost hosting** (2026): Cloudflare + Sanity free tiers; the domain is the only
  fixed cost.
- **Stable short URLs** for print/QR: `/tickets`, `/helfen`, `/mittelgschaftler`
  redirect to the current external targets.

## Git

`develop` is the integration branch, `main` is for releases; feature branches
(`feat/<name>`, `fix/<name>`) branch off `develop`. Conventional commits. Pre-commit
runs Biome + typecheck; CI runs typecheck, lint, tests and build.
