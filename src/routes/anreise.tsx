import { createFileRoute } from "@tanstack/react-router";
import { AnreisePage } from "#/features/location/components/AnreisePage";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/anreise")({
	head: () => ({
		meta: [
			{ title: `${m.nav_anreise()} — Grundstock Festival 2026` },
			{ name: "description", content: m.anreise_intro() },
		],
		links: [{ rel: "canonical", href: `${site.baseUrl}/anreise` }],
	}),
	component: AnreisePage,
});
