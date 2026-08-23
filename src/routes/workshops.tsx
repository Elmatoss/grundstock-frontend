import { createFileRoute } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { loadFestivalMode } from "#/features/festival/hooks/useFestival";
import { workshopListQueryOptions } from "#/features/workshops/api/workshops";
import { WorkshopsPage } from "#/features/workshops/components/WorkshopsPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/workshops")({
	// The year comes from the CMS, so the loader has to resolve which edition the
	// page is about before it can ask for its programme
	loader: async ({ context }) => {
		const { featured } = await loadFestivalMode(context.queryClient);
		if (featured) {
			await context.queryClient.ensureQueryData(
				workshopListQueryOptions(featured.year),
			);
		}
		return { year: featured?.year ?? null };
	},
	head: ({ loaderData }) =>
		seo({
			title: loaderData?.year
				? m.page_title({ page: m.nav_workshops(), year: loaderData.year })
				: m.nav_workshops(),
			description: m.workshops_text(),
			path: "/workshops",
		}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: WorkshopsPage,
});
