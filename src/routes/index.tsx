import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { peekFestivalMode } from "#/features/festival/hooks/useFestival";
import { dateRangeShort } from "#/features/festival/lib/festival";
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
	// carousel and must never fail because Sanity is unreachable. Same reason
	// peekFestivalMode is used rather than loadFestivalMode.
	loader: async ({ context }) => {
		const { featured } = await peekFestivalMode(context.queryClient);
		if (featured) {
			await context.queryClient.prefetchQuery(
				artistListQueryOptions(featured.year),
			);
		}
		// Rolled here rather than in the component: a loader runs once per page load
		// and its return value is serialised into the SSR payload, so the client
		// hydrates with the server's number instead of drawing a different ten.
		return { featured, teaserSeed: randomSeed() };
	},
	head: ({ loaderData }) => {
		const featured = loaderData?.featured ?? null;
		return {
			...seo({
				title: featured
					? m.meta_title({
							year: featured.year,
							dates: dateRangeShort(featured),
						})
					: "Grundstock Festival",
				description: featured
					? m.meta_description({
							year: featured.year,
							dates: dateRangeShort(featured),
						})
					: m.festival_tba_text(),
				path: "/",
			}),
			// No event markup without an edition: a MusicFestival with no dates is
			// worse than no structured data at all
			scripts: featured
				? [
						{
							type: "application/ld+json",
							children: JSON.stringify({
								"@context": "https://schema.org",
								"@type": "MusicFestival",
								name: `Grundstock Festival ${featured.year}`,
								url: site.baseUrl,
								startDate: featured.from,
								endDate: featured.to,
								eventAttendanceMode:
									"https://schema.org/OfflineEventAttendanceMode",
								eventStatus: "https://schema.org/EventScheduled",
								description: m.meta_description({
									year: featured.year,
									dates: dateRangeShort(featured),
								}),
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
					]
				: [],
		};
	},
	component: HomePage,
});
