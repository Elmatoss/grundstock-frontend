import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "#/features/home/components/HomePage";
import { featuredArtistsQueryOptions } from "#/features/lineup/api/artists";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/")({
	// prefetchQuery (not ensureQueryData): the homepage renders fine without
	// the carousel and must never fail because Sanity is unreachable
	loader: ({ context }) =>
		context.queryClient.prefetchQuery(featuredArtistsQueryOptions),
	head: () => ({
		meta: [{ title: m.meta_title() }],
		links: [{ rel: "canonical", href: `${site.baseUrl}/` }],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "MusicFestival",
					name: "Grundstock Festival 2026",
					startDate: "2026-08-13",
					endDate: site.festivalEndDate,
					eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
					eventStatus: "https://schema.org/EventScheduled",
					description: m.meta_description(),
					image: [`${site.baseUrl}/recap-poster.jpg`],
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
