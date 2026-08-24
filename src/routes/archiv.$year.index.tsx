import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { memoryListQueryOptions } from "#/features/archive/api/archive";
import { ArchiveYearPage } from "#/features/archive/components/ArchiveYearPage";
import { loadArchivedEdition } from "#/features/archive/lib/loadArchivedEdition";
import { artistListQueryOptions } from "#/features/lineup/api/artists";
import { workshopListQueryOptions } from "#/features/workshops/api/workshops";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/archiv/$year/")({
	loader: async ({ context, params }) => {
		const { edition, isFeatured } = await loadArchivedEdition(
			context.queryClient,
			params.year,
		);
		await Promise.all([
			context.queryClient.ensureQueryData(artistListQueryOptions(edition.year)),
			context.queryClient.ensureQueryData(
				workshopListQueryOptions(edition.year),
			),
			context.queryClient.ensureQueryData(memoryListQueryOptions(edition.year)),
		]);
		return { edition, isFeatured };
	},
	head: ({ loaderData, params }) => {
		if (!loaderData) throw notFound();
		return seo({
			title: `Grundstock ${loaderData.edition.year} — ${m.archive_title()}`,
			description: m.archive_year_meta({ year: loaderData.edition.year }),
			path: `/archiv/${params.year}`,
			// While an ended edition is still the site's featured one, this page is a
			// second copy of /lineup and /workshops. It stays reachable — links to it
			// must not break — but it should not compete with them in search.
			noindex: loaderData.isFeatured,
		});
	},
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: ArchiveYearPage,
});
