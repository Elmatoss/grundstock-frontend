import { defineConfig } from "vitest/config";

// Separate from vite.config.ts on purpose: the Cloudflare plugin is
// incompatible with Vitest's environment overrides.
export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		environment: "jsdom",
	},
});
