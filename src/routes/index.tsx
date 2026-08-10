import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { HomePage } from "#/features/home/components/HomePage";
import { artistListQueryOptions } from "#/features/lineup/api/artists";
import { randomSeed } from "#/lib/random";
import { seo } from "#/lib/seo";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/")({
	// `?t=2026-08-14T22:45` pins the hero's clock for previewing festival mode
	validateSearch: z.object({
		t: z.string().optional().catch(undefined),
	}),
	// One artist query for the whole site now that the teaser draws its ten from the
	// full lineup — the same cache entry the hero's live card and /lineup use, so a
	// visitor who clicks through fetches nothing again.
	//
	// prefetchQuery (not ensureQueryData): the homepage renders fine without the
	// carousel and must never fail because Sanity is unreachable.
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(artistListQueryOptions);
		// Rolled here rather than in the component: a loader runs once per page load
		// and its return value is serialised into the SSR payload, so the client
		// hydrates with the server's number instead of drawing a different ten.
		return { teaserSeed: randomSeed() };
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
