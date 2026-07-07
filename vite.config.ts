import { cloudflare } from "@cloudflare/vite-plugin";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/paraglide",
			strategy: ["url", "baseLocale"],
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
		}),
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
});

export default config;
