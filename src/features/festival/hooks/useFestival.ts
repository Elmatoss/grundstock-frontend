import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { editionListQueryOptions } from "../api/editions";
import { type FestivalMode, selectFestivalMode } from "../lib/festival";
import type { Edition } from "../types";

/**
 * Which festival the page is about.
 *
 * Deliberately `useQuery`, not the suspense variant: the root loader prefetches
 * the editions, so in practice this resolves synchronously — but if Sanity is
 * unreachable the site degrades to "no festival announced" instead of throwing on
 * every single page, including the ones that are pure static copy. Pages that
 * genuinely need programme data still fail loudly, because their own
 * `ensureQueryData` throws into their `errorComponent`.
 *
 * `Date.now()` at render is safe here at the granularity that matters: the phase
 * of a multi-day festival cannot differ between the server render and hydration
 * unless the request lands in the exact minute a festival opens or ends. The
 * components that flip on the clock minute-to-minute use `useNow` instead.
 *
 * `pinnedNow` overrides the clock for the `?t=` preview, so the whole
 * countdown → live → farewell progression can be reviewed months out of season
 * rather than being discovered wrong on the day.
 */
export function useFestival(pinnedNow?: number | null): FestivalMode {
	const { data: editions } = useQuery(editionListQueryOptions);
	return useMemo(
		() => selectFestivalMode(editions ?? [], pinnedNow ?? Date.now()),
		[editions, pinnedNow],
	);
}

/**
 * The loader-side equivalent, for routes that need to know the year up front.
 *
 * Throws if the editions cannot be fetched, which is right for a data route: it
 * lands in the route's `errorComponent` rather than rendering a page that quietly
 * claims there is no festival.
 */
export async function loadFestivalMode(queryClient: QueryClient) {
	const editions = await queryClient.ensureQueryData(editionListQueryOptions);
	return selectFestivalMode(editions, Date.now());
}

/**
 * The same, but never throwing — for the root route, whose failure would take the
 * whole site's shell down with it. An unreachable CMS degrades to "no festival
 * announced" in the document title, and the page below still renders.
 */
export async function peekFestivalMode(queryClient: QueryClient) {
	await queryClient.prefetchQuery(editionListQueryOptions);
	const editions =
		queryClient.getQueryData<Edition[]>(editionListQueryOptions.queryKey) ?? [];
	return selectFestivalMode(editions, Date.now());
}
