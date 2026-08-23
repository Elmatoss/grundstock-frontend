import { queryOptions } from "@tanstack/react-query";
import { sanityFetch } from "#/lib/sanity";
import { zEditionList } from "../types";

/**
 * Every edition, newest first — the one query the whole site is built on.
 *
 * Prefetched in the root loader so any page can work out which year it is about
 * without a waterfall. There will only ever be a handful of these, so they are
 * fetched as one list rather than one document at a time; the archive needs them
 * all anyway.
 */
export const editionListQueryOptions = queryOptions({
	queryKey: ["editions"],
	queryFn: async () => {
		const result = await sanityFetch(
			`*[_type == "festivalEdition"] | order(year desc){
				year,
				from,
				to,
				programmeDays,
				recap,
				aftermovieYoutubeId,
				aftermoviePoster
			}`,
		);
		return zEditionList.parse(result);
	},
	staleTime: 5 * 60 * 1000,
});
