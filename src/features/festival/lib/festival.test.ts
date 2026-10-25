import { describe, expect, it } from "vitest";
import type { Edition } from "../types";
import {
	dateRangeLabel,
	editionPhase,
	latestAftermovie,
	programmeDates,
	selectFestivalMode,
} from "./festival";

/** Berlin wall clock → instant, for readable expectations. */
const at = (iso: string) => Date.parse(`${iso}+02:00`);

function edition(year: number, partial: Partial<Edition> = {}): Edition {
	return {
		year,
		from: `${year}-08-13T14:00:00+02:00`,
		to: `${year}-08-16T12:00:00+02:00`,
		programmeDays: 3,
		...partial,
	};
}

describe("editionPhase", () => {
	const e = edition(2026);

	it("is upcoming right up to the minute the gates open", () => {
		expect(editionPhase(e, at("2026-08-13T13:59:00"))).toBe("upcoming");
		expect(editionPhase(e, at("2026-08-13T14:00:00"))).toBe("live");
	});

	it("stays live through the last night and the departure morning", () => {
		expect(editionPhase(e, at("2026-08-16T04:00:00"))).toBe("live");
		expect(editionPhase(e, at("2026-08-16T11:59:00"))).toBe("live");
	});

	it("is past from the end of the departure day", () => {
		expect(editionPhase(e, at("2026-08-16T12:00:00"))).toBe("past");
	});
});

describe("selectFestivalMode", () => {
	it("features the upcoming edition and counts down to it", () => {
		const mode = selectFestivalMode([edition(2026)], at("2026-07-01T12:00:00"));
		expect(mode.upcoming?.year).toBe(2026);
		expect(mode.featured?.year).toBe(2026);
		expect(mode.isOver).toBe(false);
		expect(mode.archive).toEqual([]);
	});

	// The whole point of Phase 1: after the festival the programme stays on the
	// site, with a thank-you on top of it, rather than being replaced by
	// placeholders for a year that has not been announced yet.
	it("keeps showing the edition that just ended, and says it is over", () => {
		const mode = selectFestivalMode(
			[edition(2026), edition(2025)],
			at("2026-08-23T12:00:00"),
		);
		expect(mode.upcoming).toBeNull();
		expect(mode.featured?.year).toBe(2026);
		expect(mode.isOver).toBe(true);
		// 2026 is on display, so only 2025 is in the archive
		expect(mode.archive.map((e) => e.year)).toEqual([2025]);
	});

	it("moves the old edition into the archive as soon as a new year is published", () => {
		const mode = selectFestivalMode(
			[edition(2027), edition(2026), edition(2025)],
			at("2026-08-23T12:00:00"),
		);
		expect(mode.upcoming?.year).toBe(2027);
		expect(mode.featured?.year).toBe(2027);
		expect(mode.isOver).toBe(false);
		expect(mode.archive.map((e) => e.year)).toEqual([2026, 2025]);
	});

	// Announcing next year must not hijack the festival that is happening now
	it("prefers the running festival over an already-announced later one", () => {
		const mode = selectFestivalMode(
			[edition(2027), edition(2026)],
			at("2026-08-14T22:00:00"),
		);
		expect(mode.upcoming?.year).toBe(2026);
		expect(
			editionPhase(mode.featured as Edition, at("2026-08-14T22:00:00")),
		).toBe("live");
	});

	it("has nothing to show when the CMS is empty", () => {
		const mode = selectFestivalMode([], at("2026-08-23T12:00:00"));
		expect(mode.featured).toBeNull();
		// not "over" — there is no festival to have ended
		expect(mode.isOver).toBe(false);
	});
});

describe("programmeDates", () => {
	it("derives the days from the start date", () => {
		expect(programmeDates(edition(2026))).toEqual([
			"2026-08-13",
			"2026-08-14",
			"2026-08-15",
		]);
	});

	it("reads day 1 in festival time, not UTC", () => {
		// 00:30 CEST is still 22:30 UTC the day before — the calendar date an
		// editor means is the local one
		expect(
			programmeDates(edition(2026, { from: "2026-08-13T00:30:00+02:00" }))[0],
		).toBe("2026-08-13");
	});

	it("handles an edition that is not three days and does not start on a Thursday", () => {
		expect(
			programmeDates(
				edition(2027, { from: "2027-08-20T16:00:00+02:00", programmeDays: 4 }),
			),
		).toEqual(["2027-08-20", "2027-08-21", "2027-08-22", "2027-08-23"]);
	});

	it("crosses a month boundary", () => {
		expect(
			programmeDates(
				edition(2027, { from: "2027-08-30T14:00:00+02:00", programmeDays: 3 }),
			),
		).toEqual(["2027-08-30", "2027-08-31", "2027-09-01"]);
	});
});

describe("dateRangeLabel", () => {
	it("collapses the shared month and year", () => {
		// de is the default locale in tests
		expect(dateRangeLabel(edition(2026))).toBe("13.–16. August 2026");
	});
});

describe("latestAftermovie", () => {
	it("picks the newest edition that actually has one", () => {
		const editions = [
			edition(2026),
			edition(2025, { aftermovieYoutubeId: "sACZxjbCPls" }),
		];
		expect(latestAftermovie(editions)?.year).toBe(2025);
	});

	it("is null when no edition has one", () => {
		expect(latestAftermovie([edition(2026)])).toBeNull();
	});
});
