import { queryOptions } from "@tanstack/react-query";
import { sanityFetch } from "#/lib/sanity";
import { zEditionSummaryList, zMemoryList } from "../types";

/**
 * Every edition with a count of what it holds, for the archive index.
 *
 * One request for the whole listing rather than a programme query per year: the
 * cards only need to know whether there is anything behind them and roughly how
 * much.
 */
export const editionSummaryListQueryOptions = queryOptions({
	queryKey: ["editions", "summary"],
	queryFn: async () => {
		const result = await sanityFetch(
			`*[_type == "festivalEdition"] | order(year desc){
				year,
				from,
				to,
				programmeDays,
				recap,
				aftermovieYoutubeId,
				aftermoviePoster,
				"artistCount": count(*[_type == "artist" && references(^._id)]),
				"workshopCount": count(*[_type == "workshop" && references(^._id)]),
				"memoryCount": count(*[_type == "memory" && references(^._id) && consentChecked == true])
			}`,
		);
		return zEditionSummaryList.parse(result);
	},
	staleTime: 5 * 60 * 1000,
});

/**
 * A year's memories — consent-gated in the query itself.
 *
 * `consentChecked` is the whole reason that field exists: a photo of recognisable
 * people is not published until somebody has confirmed they are happy with it.
 * Filtering here rather than in the component means no unapproved image is ever
 * sent to a browser, not even to be hidden by CSS.
 */
export const memoryListQueryOptions = (year: number) =>
	queryOptions({
		queryKey: ["edition", year, "memories"],
		queryFn: async () => {
			const result = await sanityFetch(
				`*[_type == "memory" && edition->year == $year && consentChecked == true] | order(order asc, _createdAt asc){
					"id": _id,
					image,
					youtubeId,
					caption
				}`,
				{ year },
			);
			return zMemoryList.parse(result);
		},
		staleTime: 5 * 60 * 1000,
	});
