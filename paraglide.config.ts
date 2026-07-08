import type { compile } from "@inlang/paraglide-js";

// Single source of truth for the Paraglide compiler, imported by BOTH
// vite.config.ts (plugin) and scripts/compile-i18n.ts (prepare hook / CI).
// The bare `paraglide-js compile` CLI must not be used: it knows nothing of
// these options and compiles default strategy/urlPatterns, which breaks /en
// routing until the vite plugin recompiles.
export const paraglideCompilerOptions = {
	project: "./project.inlang",
	outdir: "./src/paraglide",
	// url resolves the locale (SEO-canonical); cookie only persists an
	// explicit switcher choice — first-visit Accept-Language negotiation
	// happens in src/server.ts, not here
	strategy: ["url", "cookie", "baseLocale"],
	// Explicit patterns so the localized root is "/en" (not "/en/") —
	// otherwise the router's trailing-slash normalization and localizeUrl
	// redirect each other in an infinite 307 loop
	urlPatterns: [
		{
			pattern: "/",
			localized: [
				["en", "/en"],
				["de", "/"],
			],
		},
		{
			pattern: "/:path(.*)",
			localized: [
				["en", "/en/:path(.*)"],
				["de", "/:path(.*)"],
			],
		},
	],
} satisfies Parameters<typeof compile>[0];
