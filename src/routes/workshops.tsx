import { createFileRoute } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { workshopListQueryOptions } from "#/features/workshops/api/workshops";
import { WorkshopsPage } from "#/features/workshops/components/WorkshopsPage";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/workshops")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(workshopListQueryOptions),
	head: () => ({
		meta: [{ title: `${m.nav_workshops()} — Grundstock Festival 2026` }],
		links: [{ rel: "canonical", href: `${site.baseUrl}/workshops` }],
	}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: WorkshopsPage,
});
