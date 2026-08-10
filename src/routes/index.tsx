import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { HomePage } from "#/features/home/components/HomePage";
import {
	artistListQueryOptions,
	featuredArtistsQueryOptions,
} from "#/features/lineup/api/artists";
import {
	isFestivalMode,
	parsePreviewInstant,
} from "#/features/timetable/lib/schedule";
import { seo } from "#/lib/seo";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/")({
	// `?t=2026-08-14T22:45` pins the hero's clock for previewing festival mode
	validateSearch: z.object({
		t: z.string().optional().catch(undefined),
	}),
	loaderDeps: ({ search }) => ({ t: search.t }),
	// prefetchQuery (not ensureQueryData): the homepage renders fine without
	// the carousel and must never fail because Sanity is unreachable
	loader: ({ context, deps }) => {
		// The hero's live card needs every act's set times, but only while the
		// festival is actually on — outside that window the hero is a countdown and
		// this second query would be pure waste. A `?t=` preview counts as on, so the
		// preview renders server-side exactly as the real thing will.
		const preview = parsePreviewInstant(deps.t);
		const live = isFestivalMode(preview ?? Date.now());
		return Promise.all([
			context.queryClient.prefetchQuery(featuredArtistsQueryOptions),
			live
				? context.queryClient.prefetchQuery(artistListQueryOptions)
				: undefined,
		]);
	},
	head: () => ({
		...seo({
			title: m.meta_title(),
			description: m.meta_description(),
			path: "/",
		}),
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "MusicFestival",
					name: "Grundstock Festival 2026",
					url: site.baseUrl,
					startDate: site.festivalStart,
					endDate: site.festivalEndDate,
					eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
					eventStatus: "https://schema.org/EventScheduled",
					description: m.meta_description(),
					image: [`${site.baseUrl}/og-image.jpg`],
					location: {
						"@type": "Place",
						name: "Festivalgelände Vilswörth",
						address: {
							"@type": "PostalAddress",
							addressLocality: "Rieden",
							addressRegion: "Bayern",
							addressCountry: "DE",
						},
					},
					organizer: {
						"@type": "Organization",
						name: "Neues Brett e.V.",
						email: site.contactEmail,
					},
					offers: {
						"@type": "Offer",
						url: site.ticketUrl,
						availability: "https://schema.org/InStock",
					},
				}),
			},
		],
	}),
	component: HomePage,
});
