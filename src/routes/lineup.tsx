import { createFileRoute } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { artistListQueryOptions } from "#/features/lineup/api/artists";
import { LineupPage } from "#/features/lineup/components/LineupPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/lineup")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(artistListQueryOptions),
	head: () =>
		seo({
			title: `${m.nav_lineup()} — Grundstock Festival 2026`,
			description: m.lineup_text(),
			path: "/lineup",
		}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: LineupPage,
});
