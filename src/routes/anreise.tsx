import { createFileRoute } from "@tanstack/react-router";
import { AnreisePage } from "#/features/location/components/AnreisePage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/anreise")({
	head: () =>
		seo({
			title: `${m.nav_anreise()} — Grundstock Festival 2026`,
			description: m.anreise_intro(),
			path: "/anreise",
		}),
	component: AnreisePage,
});
