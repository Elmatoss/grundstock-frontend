import type { QueryClient } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { editionListQueryOptions } from "#/features/festival/api/editions";
import {
	editionPhase,
	selectFestivalMode,
} from "#/features/festival/lib/festival";

/**
 * Resolves an `/archiv/<year>` path segment to an edition that has actually
 * happened.
 *
 * Any *ended* edition is servable here, including the one still featured on the
 * main pages — a direct link to `/archiv/2026` has to work the day the festival
 * ends, not only once a new year is announced. The archive *index* is what leaves
 * the featured edition out, so nobody is sent to a duplicate from inside the site.
 *
 * A year that is still to come 404s rather than leaking next year's lineup before
 * it is announced.
 */
export async function loadArchivedEdition(
	queryClient: QueryClient,
	yearParam: string,
) {
	if (!/^\d{4}$/.test(yearParam)) throw notFound();
	const year = Number(yearParam);

	const editions = await queryClient.ensureQueryData(editionListQueryOptions);
	const now = Date.now();
	const edition = editions.find((candidate) => candidate.year === year);
	if (!edition || editionPhase(edition, now) !== "past") throw notFound();

	const { featured } = selectFestivalMode(editions, now);
	return { edition, isFeatured: featured?.year === year };
}

/**
 * The year an out-of-date artist URL should be redirected to.
 *
 * `/artists/<slug>` only serves the edition on display. Once a new year takes
 * over, every link shared during the last festival would 404 — so the slug is
 * looked up across all editions and sent to the most recent *archived* year that
 * has it. Years that have not happened yet are excluded by construction, because
 * `archive` only ever contains ended editions: an unannounced lineup cannot leak
 * through a guessed URL.
 *
 * @param years the editions containing this slug, newest first
 * @param archive the ended editions, from selectFestivalMode
 */
export function pickArchiveYear(
	years: number[],
	archive: { year: number }[],
): number | null {
	return (
		years.find((year) => archive.some((edition) => edition.year === year)) ??
		null
	);
}
