import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PageError, PagePending } from "#/components/RouteStates";
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
	loader: ({ context }) =>
		Promise.all([
			context.queryClient.ensureQueryData(artistListQueryOptions),
			context.queryClient.ensureQueryData(workshopListQueryOptions),
		]),
	head: () =>
		seo({
			title: `${m.timetable_title()} — Grundstock Festival 2026`,
			description: m.timetable_meta_description(),
			path: "/timetable",
		}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: TimetablePage,
});
