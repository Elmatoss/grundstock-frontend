import { createFileRoute } from "@tanstack/react-router";
import { TicketbedingungenPage } from "#/features/legal/Ticketbedingungen";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/ticketbedingungen")({
	head: () =>
		seo({
			title: `${m.legal_ticketbedingungen_title()} — Grundstock Festival`,
			path: "/ticketbedingungen",
			noindex: true,
		}),
	component: TicketbedingungenPage,
});
