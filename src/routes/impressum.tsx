import { createFileRoute } from "@tanstack/react-router";
import { ImpressumPage } from "#/features/legal/Impressum";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/impressum")({
	head: () =>
		seo({
			title: `${m.legal_impressum_title()} — Grundstock Festival`,
			path: "/impressum",
			noindex: true,
		}),
	component: ImpressumPage,
});
