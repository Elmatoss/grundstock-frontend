import { FESTIVAL_TIME_ZONE, intlLocale } from "#/lib/intl";
import type { Edition } from "../types";

const DAY_MS = 86_400_000;

/** Where an edition sits relative to a moment. */
export type Phase = "upcoming" | "live" | "past";

export function editionPhase(edition: Edition, now: number): Phase {
	if (now < Date.parse(edition.from)) return "upcoming";
	if (now < Date.parse(edition.to)) return "live";
	return "past";
}

export type FestivalMode = {
	/**
	 * The next festival: not started, or running right now. Null once the last
	 * edition has ended and no new one has been published — which is what makes
	 * the countdown restart the moment a new year goes live in the CMS.
	 */
	upcoming: Edition | null;
	/**
	 * The edition the main pages are about — lineup, timetable, workshops, the
	 * homepage. Normally `upcoming`; while no new year is announced it stays on the
	 * one that just ended, so a visitor after the festival still finds the whole
	 * programme rather than a set of empty placeholders. Null only when the CMS
	 * holds no editions at all.
	 */
	featured: Edition | null;
	/** The featured edition has already happened: the site says thank you. */
	isOver: boolean;
	/** Ended editions other than the featured one, newest first — the archive. */
	archive: Edition[];
};

const byYearDesc = (a: Edition, b: Edition) => b.year - a.year;
const byStartAsc = (a: Edition, b: Edition) =>
	Date.parse(a.from) - Date.parse(b.from);

/**
 * What the site is currently about.
 *
 * The rules, in the order they matter:
 *
 *  - `upcoming` is the *earliest* edition that has not ended. With 2026 still
 *    running and 2027 already announced, the site is about 2026 — announcing next
 *    year must never hijack the festival that is happening.
 *  - With nothing upcoming, `featured` falls back to the most recent ended
 *    edition instead of going blank. The festival being over is a message on top
 *    of the programme, not a reason to delete it.
 *  - The archive is therefore "ended, and not the one on display": 2026 only
 *    moves into it once a new year is published.
 */
export function selectFestivalMode(
	editions: Edition[],
	now: number,
): FestivalMode {
	const ended: Edition[] = [];
	const ahead: Edition[] = [];
	for (const edition of editions) {
		(editionPhase(edition, now) === "past" ? ended : ahead).push(edition);
	}
	ended.sort(byYearDesc);
	ahead.sort(byStartAsc);

	const upcoming = ahead[0] ?? null;
	const featured = upcoming ?? ended[0] ?? null;

	return {
		upcoming,
		featured,
		isOver: upcoming === null && featured !== null,
		archive: ended.filter((edition) => edition !== featured),
	};
}

/** The newest edition that actually has an aftermovie, if any. */
export function latestAftermovie(editions: Edition[]) {
	return (
		[...editions]
			.sort(byYearDesc)
			.find((edition) => Boolean(edition.aftermovieYoutubeId)) ?? null
	);
}

const isoDate = new Intl.DateTimeFormat("en-CA", {
	timeZone: FESTIVAL_TIME_ZONE,
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
});

/**
 * The calendar dates of an edition's programme days, as "YYYY-MM-DD".
 *
 * Day 1 is the date `from` falls on *in festival time* — Sanity stores a datetime
 * as an instant, and reading the date off the UTC form would put a 00:30 opening
 * on the previous day. Subsequent days are added as whole calendar days from noon
 * UTC, which no daylight-saving shift can move onto the wrong date.
 *
 * This is what replaced the hardcoded do/fr/sa dates: an edition that runs
 * Friday–Sunday, or for four days, needs nothing but different CMS values.
 */
export function programmeDates(edition: Edition): string[] {
	const [year, month, day] = isoDate
		.format(new Date(Date.parse(edition.from)))
		.split("-")
		.map(Number);
	const first = Date.UTC(year, month - 1, day, 12);
	return Array.from({ length: edition.programmeDays }, (_, index) =>
		new Date(first + index * DAY_MS).toISOString().slice(0, 10),
	);
}

/**
 * The calendar date of one programme day, or null if the edition has no such day.
 *
 * Callers that only need to label a single stored `dayIndex` — a workshop, an
 * artist's set list — use this instead of walking the whole date list.
 */
export function programmeDate(edition: Edition, dayIndex: number) {
	return programmeDates(edition)[dayIndex - 1] ?? null;
}

/** "13.–16. August" / "13–16 August" — no year, for use next to one. */
export function dateRangeShort(edition: Edition) {
	return new Intl.DateTimeFormat(intlLocale(), {
		day: "numeric",
		month: "long",
		timeZone: FESTIVAL_TIME_ZONE,
	}).formatRange(new Date(edition.from), new Date(edition.to));
}

/**
 * "13.–16. August 2026" / "13–16 August 2026".
 *
 * `formatRange` rather than two formatted dates glued together: it collapses the
 * shared month and year on its own, and does it correctly per locale — including
 * the cases this festival has never had yet, like a range crossing into September.
 */
export function dateRangeLabel(edition: Edition) {
	return new Intl.DateTimeFormat(intlLocale(), {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: FESTIVAL_TIME_ZONE,
	}).formatRange(new Date(edition.from), new Date(edition.to));
}
