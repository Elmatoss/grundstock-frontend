import { createFileRoute } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { loadFestivalMode } from "#/features/festival/hooks/useFestival";
import { artistListQueryOptions } from "#/features/lineup/api/artists";
import { LineupPage } from "#/features/lineup/components/LineupPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/lineup")({
	// The year comes from the CMS, so the loader has to resolve which edition the
	// page is about before it can ask for its programme
	loader: async ({ context }) => {
		const { featured } = await loadFestivalMode(context.queryClient);
		if (featured) {
			await context.queryClient.ensureQueryData(
				artistListQueryOptions(featured.year),
			);
		}
		return { year: featured?.year ?? null };
	},
	head: ({ loaderData }) =>
		seo({
			title: loaderData?.year
				? m.page_title({ page: m.nav_lineup(), year: loaderData.year })
				: m.nav_lineup(),
			description: m.lineup_text(),
			path: "/lineup",
		}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: LineupPage,
});
