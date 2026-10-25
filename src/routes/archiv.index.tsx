import { createFileRoute } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { editionSummaryListQueryOptions } from "#/features/archive/api/archive";
import { ArchiveIndexPage } from "#/features/archive/components/ArchiveIndexPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/archiv/")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(editionSummaryListQueryOptions),
	head: () =>
		seo({
			title: `${m.archive_title()} — Grundstock Festival`,
			description: m.archive_text(),
			path: "/archiv",
		}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: ArchiveIndexPage,
});
