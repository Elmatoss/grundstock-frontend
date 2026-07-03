#!/bin/bash
# PostToolUse: auto-fix formatting/lint/import-order on the file Claude just edited.
input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')
case "$file" in
	*routeTree.gen.ts | */src/paraglide/*)
		exit 0 ;;
	*.ts | *.tsx | *.js | *.jsx | *.json | *.jsonc | *.css)
		cd "$CLAUDE_PROJECT_DIR" && pnpm exec biome check --write "$file" >/dev/null 2>&1 || true ;;
esac
exit 0
