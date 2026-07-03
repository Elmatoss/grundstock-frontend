---
paths:
  - "src/routes/**"
---

# Route file conventions

- Prefer directory nesting (`projects/$projectUuid/index.tsx`) over flat dotted names once a segment has more than one child; flat (`about.tsx`) is fine for single pages.
- Pathless layouts: `_protected/route.tsx` (app shell + auth gate in `beforeLoad`), `_auth/route.tsx` (centered card shell). Guards `throw redirect({ to: '/login', search: { redirect: location.href } })`.
- A data-backed route defines: `validateSearch` (zod), `loader: ({ context }) => context.queryClient.ensureQueryData(...)`, `errorComponent`, `pendingComponent`. Use `prefetchQuery` instead of `ensureQueryData` when data is non-blocking.
- Compute page titles in the loader or route `staticData`; source strings from Paraglide messages.
- After adding/renaming route files, `pnpm generate-routes` if the dev server isn't running, then `pnpm typecheck`.
