import { createFileRoute } from "@tanstack/react-router";
import { ImpressumPage } from "#/features/legal/Impressum";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/impressum")({
	head: () => ({
		meta: [
			{ title: `${m.legal_impressum_title()} — Grundstock Festival` },
			{ name: "robots", content: "noindex" },
		],
		links: [{ rel: "canonical", href: `${site.baseUrl}/impressum` }],
	}),
	component: ImpressumPage,
});
