---
name: new-route
description: Scaffold a new TanStack Router route following project conventions (feature api + loader prefetch + i18n + route tree regen). Use when adding a new page or route.
---

Scaffold the route described by: $ARGUMENTS

1. **Placement**: pick the path under `src/routes/` per `.claude/rules/routing.md`. Protected pages go under the `_protected/` pathless layout (create it with an auth-gate `beforeLoad` if it doesn't exist yet).
2. **Data**: if the page needs data, create or extend `src/features/<domain>/api/<domain>.ts` with a `queryOptions` factory (hierarchical key, zod-parsed args, `{ signal }` passed to fetch, response schema `.parse()`). Add zod as a dependency if it's missing.
3. **Route file**: `createFileRoute` with
   - `validateSearch` (zod, `.optional().catch(undefined)`) if the page has filters/pagination,
   - `loader: ({ context }) => context.queryClient.ensureQueryData(<factory>(...))` — if `context.queryClient` isn't typed yet, wire `createRootRouteWithContext<{ queryClient: QueryClient }>()` in `src/routes/__root.tsx` once,
   - component using `useSuspenseQuery(<factory>(...))`,
   - `errorComponent` + `pendingComponent` for data-backed routes.
4. **i18n**: add title/description and all UI strings to `messages/en.json` AND `messages/de.json`; consume via `m.key()` from `#/paraglide/messages`. No hardcoded strings.
5. **Verify**: `pnpm generate-routes && pnpm typecheck && pnpm check`. Fix what they report.
