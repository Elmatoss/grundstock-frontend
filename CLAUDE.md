# grundstock-frontend

TanStack Start (SSR) deployed to Cloudflare Workers. React 19 + React Compiler, TanStack Router (file-based) + TanStack Query, Tailwind v4 (CSS-first, no config file), shadcn/ui (new-york, zinc), Paraglide i18n, Biome, Vitest, pnpm.

## Commands

- `pnpm dev` — dev server on :3000
- `pnpm typecheck` — tsc, no emit
- `pnpm check` — Biome lint + format + import-order (read-only; `check:fix` writes)
- `pnpm test` — Vitest, single run
- `pnpm generate-routes` — regenerate route tree (vite plugin also does this on dev/build)
- `pnpm i18n:compile` — compile Paraglide messages into `src/paraglide/` (runs automatically on install and dev/build)
- `pnpm build` / `pnpm deploy` — build / deploy to Cloudflare. Never deploy unprompted.

Verify changes with `pnpm typecheck && pnpm check`. A PostToolUse hook auto-formats every edited file — never spend turns on pure formatting.

## Generated files — never edit

- `src/routeTree.gen.ts` → `pnpm generate-routes`
- `src/paraglide/` → edit `messages/en.json` + `messages/de.json` instead

## Structure & conventions

- Feature-first: `src/features/<domain>/{api,components,hooks,types.ts}` — a domain owns its data layer, UI, and schemas. Routes in `src/routes/` stay thin: wire loaders, render one feature component.
- `src/components/ui/` — shadcn primitives (`pnpm dlx shadcn@latest add <name>`); `src/components/` — shared custom components; `src/lib/` — pure utils (`cn()`); `src/hooks/` — cross-cutting hooks.
- Import via the `#/*` alias (→ `src/*`), not deep relative paths.
- All user-facing strings through Paraglide: add keys to both `messages/en.json` and `messages/de.json`, consume via `m.key()` from `#/paraglide/messages`. No hardcoded UI strings in JSX.

## Data layer (TanStack Query + Router)

- `queryOptions`/`mutationOptions` factories live in `src/features/<domain>/api/` — one definition shared by loaders and components. Never inline query keys or queryFns in components.
- Hierarchical query keys: `['project', uuid, 'tasks']`. Parse/normalize args (zod) before keying so defaults produce stable keys.
- Routes: `loader` calls `context.queryClient.ensureQueryData(opts)`; component reads with `useSuspenseQuery(opts)`. Give data-backed routes an `errorComponent` and `pendingComponent`.
- Validate search params with zod `validateSearch`; use `.optional().catch(undefined)` for resilience.
- Auth/role guards belong in `beforeLoad` on pathless layout routes (`_protected/route.tsx` pattern) using `throw redirect({...})`.
- Mutations invalidate their affected queries in `onSuccess`.

Reference implementation for these patterns: `../smart-hems-service-portal-frontend` (e.g. `src/features/problem/api/problem.ts`).

## Git

- `develop` is the integration branch; feature branches (`feat/<name>`, `fix/<name>`) branch off it. `main` is for releases.
- Conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`). Never stage, commit, or push — the developer runs all git write operations himself.
- Pre-commit (husky + lint-staged) runs Biome on staged files + full typecheck; CI (`.github/workflows/ci.yml`) runs typecheck, check, and tests on pushes to main/develop and all PRs.
