import { queryOptions } from "@tanstack/react-query";
import { sanityClient } from "#/lib/sanity";
import { zArtistDetail, zArtistList } from "../types";

const CARD_PROJECTION = `
	name,
	"slug": slug.current,
	genres,
	shortBlurb,
	image,
	featured,
	performances[]{ day, time, stage->{ name, "slug": slug.current, order, tagline } }
`;

export const artistListQueryOptions = queryOptions({
	queryKey: ["artists", "list"],
	queryFn: async () => {
		const result = await sanityClient.fetch(
			`*[_type == "artist" && defined(slug.current)] | order(name asc) { ${CARD_PROJECTION} }`,
		);
		return zArtistList.parse(result);
	},
	staleTime: 5 * 60 * 1000,
});

export const artistDetailQueryOptions = (slug: string) =>
	queryOptions({
		queryKey: ["artist", slug],
		queryFn: async () => {
			const result = await sanityClient.fetch(
				`*[_type == "artist" && slug.current == $slug][0]{ ${CARD_PROJECTION}, bio, links }`,
				{ slug },
			);
			// null = unknown slug; the route loader turns this into a 404
			return result === null ? null : zArtistDetail.parse(result);
		},
		staleTime: 5 * 60 * 1000,
	});
