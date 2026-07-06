import { createFileRoute } from "@tanstack/react-router";
import { VereinPage } from "#/features/verein/components/VereinPage";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/verein")({
	head: () => ({
		meta: [
			{ title: `${m.nav_verein()} — Grundstock Festival 2026` },
			{ name: "description", content: m.verein_intro() },
		],
		links: [{ rel: "canonical", href: `${site.baseUrl}/verein` }],
	}),
	component: VereinPage,
});
