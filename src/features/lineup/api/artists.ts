import { queryOptions } from "@tanstack/react-query";
import { sanityFetch } from "#/lib/sanity";
import { zArtistDetail, zArtistList } from "../types";

const CARD_PROJECTION = `
	name,
	"slug": slug.current,
	genres,
	shortBlurb,
	image,
	performances[]{ dayIndex, start, end, stage->{ name, "slug": slug.current, order, tagline } }
`;

// Every artist belongs to exactly one year, so the year is part of the key rather
// than a filter applied after the fact: 2026's lineup and 2027's are different
// cache entries that never invalidate each other, and the archive can hold
// several years in cache at once.
export const artistListQueryOptions = (year: number) =>
	queryOptions({
		queryKey: ["edition", year, "artists", "list"],
		queryFn: async () => {
			const result = await sanityFetch(
				`*[_type == "artist" && edition->year == $year && defined(slug.current)] | order(name asc) { ${CARD_PROJECTION} }`,
				{ year },
			);
			return zArtistList.parse(result);
		},
		staleTime: 5 * 60 * 1000,
	});

export const artistDetailQueryOptions = (year: number, slug: string) =>
	queryOptions({
		queryKey: ["edition", year, "artist", slug],
		queryFn: async () => {
			const result = await sanityFetch(
				`*[_type == "artist" && edition->year == $year && slug.current == $slug][0]{ ${CARD_PROJECTION}, bio, links }`,
				{ year, slug },
			);
			// null = unknown slug for this year; the route loader turns this into a 404
			return result === null ? null : zArtistDetail.parse(result);
		},
		staleTime: 5 * 60 * 1000,
	});
