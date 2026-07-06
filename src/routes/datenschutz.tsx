import { createFileRoute } from "@tanstack/react-router";
import { DatenschutzPage } from "#/features/legal/Datenschutz";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/datenschutz")({
	head: () =>
		seo({
			title: `${m.legal_datenschutz_title()} — Grundstock Festival`,
			path: "/datenschutz",
			noindex: true,
		}),
	component: DatenschutzPage,
});
