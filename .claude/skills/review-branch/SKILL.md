---
name: review-branch
description: Review the current branch against develop (or a given base) at high effort, including stack-specific convention checks.
disable-model-invocation: true
---

Review the current branch against base branch `${ARGUMENTS:-develop}`.

1. `git fetch` and get the diff vs the merge-base with the base branch.
2. Invoke the `code-review` skill at high effort on that diff.
3. Additionally verify these project-specific concerns (report as findings, same format):
   - Routes follow `.claude/rules/routing.md` (loader prefetch + `useSuspenseQuery`, no inline query keys/fns in components).
   - Query/mutation factories live in `src/features/<domain>/api/`, mutations invalidate in `onSuccess`.
   - No hardcoded user-facing strings; `messages/en.json` and `messages/de.json` have key parity.
   - No edits to generated files (`src/routeTree.gen.ts`, `src/paraglide/`).
   - `pnpm typecheck` and `pnpm check` pass on the branch.
4. Report findings ranked by severity. Do not fix anything unless explicitly asked.
