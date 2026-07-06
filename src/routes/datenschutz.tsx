import { createFileRoute } from "@tanstack/react-router";
import { DatenschutzPage } from "#/features/legal/Datenschutz";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/datenschutz")({
	head: () => ({
		meta: [
			{ title: `${m.legal_datenschutz_title()} — Grundstock Festival` },
			{ name: "robots", content: "noindex" },
		],
		links: [{ rel: "canonical", href: `${site.baseUrl}/datenschutz` }],
	}),
	component: DatenschutzPage,
});
