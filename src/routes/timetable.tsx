import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PageError, PagePending } from "#/components/RouteStates";
import { loadFestivalMode } from "#/features/festival/hooks/useFestival";
import { artistListQueryOptions } from "#/features/lineup/api/artists";
import { TimetablePage } from "#/features/timetable/components/TimetablePage";
import { workshopListQueryOptions } from "#/features/workshops/api/workshops";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/timetable")({
	// `?t=2026-08-14T22:45` pins the clock so the live layer can be reviewed long
	// before the festival. catch(undefined) so a mangled value degrades to the
	// ordinary page instead of a search-param error.
	validateSearch: z.object({
		t: z.string().optional().catch(undefined),
	}),
	// Both, because the timetable interleaves music and workshops on one rail
	loader: async ({ context }) => {
		const { featured } = await loadFestivalMode(context.queryClient);
		if (featured) {
			await Promise.all([
				context.queryClient.ensureQueryData(
					artistListQueryOptions(featured.year),
				),
				context.queryClient.ensureQueryData(
					workshopListQueryOptions(featured.year),
				),
			]);
		}
		return { year: featured?.year ?? null };
	},
	head: ({ loaderData }) =>
		seo({
			title: loaderData?.year
				? m.page_title({ page: m.timetable_title(), year: loaderData.year })
				: m.timetable_title(),
			description: m.timetable_meta_description(),
			path: "/timetable",
		}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: TimetablePage,
});
