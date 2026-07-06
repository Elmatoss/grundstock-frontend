import { createFileRoute } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { workshopListQueryOptions } from "#/features/workshops/api/workshops";
import { WorkshopsPage } from "#/features/workshops/components/WorkshopsPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/workshops")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(workshopListQueryOptions),
	head: () =>
		seo({
			title: `${m.nav_workshops()} — Grundstock Festival 2026`,
			description: m.workshops_text(),
			path: "/workshops",
		}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: WorkshopsPage,
});
