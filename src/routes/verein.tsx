import { createFileRoute } from "@tanstack/react-router";
import { VereinPage } from "#/features/verein/components/VereinPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/verein")({
	head: () =>
		seo({
			title: `${m.nav_verein()} — Grundstock Festival 2026`,
			description: m.verein_intro(),
			path: "/verein",
		}),
	component: VereinPage,
});
