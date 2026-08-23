import { describe, expect, it } from "vitest";
import type { Edition } from "#/features/festival/types";
import type { ArtistCard } from "#/features/lineup/types";
import type { Workshop } from "#/features/workshops/types";
import {
	buildSchedule,
	focusSlot,
	liveState,
	minutesLeft,
	minutesUntil,
	railHeightRem,
	slotProgress,
} from "./schedule";

/** Berlin wall clock → instant, for writing expectations readably. */
const at = (iso: string) => Date.parse(`${iso}+02:00`);

// The 2026 edition, so the expectations below can stay in real dates. A day is
// stored as an offset now, but the fixtures still name the weekday — the mapping
// lives here so the tests read the way the programme is actually written down.
const EDITION: Edition = {
	year: 2026,
	from: "2026-08-13T14:00:00+02:00",
	to: "2026-08-16T12:00:00+02:00",
	programmeDays: 3,
};

const DAY_INDEX = { do: 1, fr: 2, sa: 3 } as const;
type TestDay = keyof typeof DAY_INDEX;

const schedule = (artists: ArtistCard[], workshops: Workshop[] = []) =>
	buildSchedule(artists, workshops, EDITION);

const workshop = (
	title: string,
	day: TestDay,
	start: string | null,
): Workshop => ({
	title,
	slug: title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "und"),
	dayIndex: DAY_INDEX[day],
	start,
});

function artist(
	name: string,
	performances: {
		day: TestDay;
		start?: string | null;
		end?: string | null;
		stage?: string;
		order?: number;
	}[],
): ArtistCard {
	return {
		name,
		slug: name.toLowerCase().replaceAll(" ", "-"),
		performances: performances.map((p) => ({
			dayIndex: DAY_INDEX[p.day],
			start: p.start ?? null,
			end: p.end ?? null,
			stage: p.stage
				? { name: p.stage, slug: p.stage.toLowerCase(), order: p.order ?? 0 }
				: null,
		})),
	};
}

describe("buildSchedule", () => {
	it("resolves a wall clock time on its festival day to an instant", () => {
		const [thursday] = schedule([
			artist("Sylvenklang", [
				{ day: "do", start: "18:30", end: "19:30", stage: "Mainstage" },
			]),
		]);
		expect(thursday.slots[0].startAt).toBe(at("2026-08-13T18:30:00"));
		expect(thursday.slots[0].endAt).toBe(at("2026-08-13T19:30:00"));
		expect(thursday.slots[0].durationMin).toBe(60);
	});

	it("puts an after-midnight set on the next calendar day, still under its own festival day", () => {
		// 01:10 "Donnerstag" is really Friday morning — the rule that makes the
		// whole day+wall-clock model work
		const [thursday] = schedule([
			artist("Afroskater", [
				{ day: "do", start: "01:10", end: "03:00", stage: "Schepperschuppen" },
			]),
		]);
		expect(thursday.slots[0].startAt).toBe(at("2026-08-14T01:10:00"));
		expect(thursday.slots[0].endAt).toBe(at("2026-08-14T03:00:00"));
		expect(thursday.slots[0].durationMin).toBe(110);
	});

	it("carries a set that runs through midnight into the next day", () => {
		const [thursday] = schedule([
			artist("Lugiae", [
				{ day: "do", start: "23:20", end: "01:10", stage: "Schepperschuppen" },
			]),
		]);
		expect(thursday.slots[0].startAt).toBe(at("2026-08-13T23:20:00"));
		expect(thursday.slots[0].endAt).toBe(at("2026-08-14T01:10:00"));
		expect(thursday.slots[0].durationMin).toBe(110);
	});

	it("treats an end of 00:00 as midnight *after* the set, not before it", () => {
		const [, friday] = schedule([
			artist("Roadmansteves", [
				{ day: "fr", start: "22:30", end: "00:00", stage: "Mainstage" },
			]),
		]);
		expect(friday.slots[0].endAt).toBe(at("2026-08-15T00:00:00"));
		expect(friday.slots[0].durationMin).toBe(90);
	});

	it("orders a day chronologically across stages and keeps the day's real end", () => {
		const [, friday] = schedule([
			// deliberately out of order, and the last set to start is not the last
			// one to finish
			artist("Berthold", [
				{
					day: "fr",
					start: "00:00",
					end: "01:15",
					stage: "Schepper",
					order: 2,
				},
			]),
			artist("Nami", [
				{ day: "fr", start: "11:30", end: "12:30", stage: "Turtle", order: 1 },
			]),
			artist("Steves", [
				{
					day: "fr",
					start: "22:30",
					end: "00:00",
					stage: "Mainstage",
					order: 0,
				},
			]),
		]);
		expect(friday.slots.map((slot) => slot.title)).toEqual([
			"Nami",
			"Steves",
			"Berthold",
		]);
		expect(friday.startAt).toBe(at("2026-08-14T11:30:00"));
		// Berthold's 01:15 finish, not Steves' 00:00 despite Steves starting later
		expect(friday.endAt).toBe(at("2026-08-15T01:15:00"));
	});

	it("orders simultaneous sets by stage, then name, so the page never reshuffles", () => {
		const [thursday] = schedule([
			artist("Zed", [
				{ day: "do", start: "20:00", end: "21:00", stage: "Turtle", order: 1 },
			]),
			artist("Bea", [
				{ day: "do", start: "20:00", end: "21:00", stage: "Turtle", order: 1 },
			]),
			artist("Ann", [
				{ day: "do", start: "20:00", end: "21:00", stage: "Main", order: 0 },
			]),
		]);
		expect(thursday.slots.map((slot) => slot.title)).toEqual([
			"Ann",
			"Bea",
			"Zed",
		]);
	});

	it("collects acts whose time is not fixed yet instead of dropping them", () => {
		const [thursday] = schedule([
			artist("Noch offen", [{ day: "do", stage: "Mainstage" }]),
			artist("Halb offen", [{ day: "do", start: "20:00", stage: "Mainstage" }]),
		]);
		expect(thursday.slots).toHaveLength(0);
		expect(thursday.pending.map((p) => p.title)).toEqual([
			"Halb offen",
			"Noch offen",
		]);
	});

	it("always returns all three days, even with no programme at all", () => {
		expect(schedule([]).map((day) => day.dayIndex)).toEqual([1, 2, 3]);
	});

	it("resolves times identically whatever timezone the viewer is in", () => {
		// The instant is absolute because the offset is baked in — this is the whole
		// reason times are not formatted with toLocaleTimeString anywhere
		const [thursday] = schedule([
			artist("Nunataq", [
				{ day: "do", start: "22:00", end: "23:20", stage: "Schepper" },
			]),
		]);
		expect(new Date(thursday.slots[0].startAt).toISOString()).toBe(
			"2026-08-13T20:00:00.000Z",
		);
	});
});

describe("workshops on the rail", () => {
	const programme = () =>
		schedule(
			[
				artist("Turtle DJ", [
					{
						day: "fr",
						start: "13:00",
						end: "14:15",
						stage: "Turtle",
						order: 1,
					},
				]),
			],
			[
				workshop("Cyanotypie", "fr", "12:00"),
				workshop("Ton & Takt", "fr", "13:00"),
			],
		);

	it("interleaves them chronologically with the music", () => {
		const [, friday] = programme();
		expect(friday.slots.map((slot) => [slot.start, slot.title])).toEqual([
			["12:00", "Cyanotypie"],
			// same minute as the workshop: the act is the headline programme
			["13:00", "Turtle DJ"],
			["13:00", "Ton & Takt"],
		]);
	});

	it("marks an assumed end as assumed rather than passing it off as published", () => {
		const [, friday] = programme();
		const workshop = friday.slots.find((slot) => slot.kind === "workshop");
		expect(workshop?.end).toBeNull();
		expect(workshop?.durationMin).toBeNull();
		// the assumed hour still exists, so "which one is on right now" works
		expect(workshop?.endAt).toBe(at("2026-08-14T13:00:00"));
	});

	it("refuses to quote progress or minutes left for an assumed end", () => {
		const [, friday] = programme();
		const workshop = friday.slots.find((slot) => slot.kind === "workshop");
		if (!workshop) throw new Error("expected a workshop slot");
		const midway = at("2026-08-14T12:30:00");
		// a progress bar over a guessed hour would present a guess as a measurement
		expect(slotProgress(workshop, midway)).toBeNull();
		expect(minutesLeft(workshop, midway)).toBeNull();
		// and the row must not be scaled by a duration nobody published
		expect(railHeightRem(workshop.durationMin)).toBe(railHeightRem(30));
	});

	it("highlights a workshop for the assumed hour and no longer", () => {
		const days = programme();
		const on = (iso: string) =>
			liveState(days, at(iso))
				.current.filter((slot) => slot.kind === "workshop")
				.map((slot) => slot.title);
		expect(on("2026-08-14T12:00:00")).toEqual(["Cyanotypie"]);
		expect(on("2026-08-14T12:59:00")).toEqual(["Cyanotypie"]);
		expect(on("2026-08-14T13:00:00")).toEqual(["Ton & Takt"]);
	});

	it("reports a concurrent act and workshop, but scrolls to the act", () => {
		const days = programme();
		const state = liveState(days, at("2026-08-14T13:30:00"));
		expect(state.current.map((slot) => slot.title)).toEqual([
			"Turtle DJ",
			"Ton & Takt",
		]);
		expect(focusSlot(state)?.title).toBe("Turtle DJ");
	});

	it("falls back to a workshop when nothing else is on", () => {
		const days = schedule([], [workshop("Bier Yoga", "sa", "14:00")]);
		const state = liveState(days, at("2026-08-15T14:10:00"));
		expect(focusSlot(state)?.title).toBe("Bier Yoga");
	});

	it("keeps a workshop out of the stage handover logic", () => {
		// A workshop between two Turtle sets must not make the second one announce
		// "Turtle" again — it carries no stage at all
		const [, friday] = programme();
		expect(
			friday.slots.filter((slot) => slot.kind === "workshop")[0].stage,
		).toBeNull();
	});

	it("collects a workshop with no time yet, unlinked", () => {
		const [, friday] = schedule([], [workshop("Noch offen", "fr", null)]);
		expect(friday.pending).toEqual([
			{ key: "workshop-noch-offen", title: "Noch offen", artistSlug: null },
		]);
	});
});

describe("liveState", () => {
	const days = schedule([
		artist("Opener", [
			{ day: "do", start: "17:30", end: "18:15", stage: "Mainstage" },
		]),
		// 15 minutes of changeover between these two
		artist("Headliner", [
			{ day: "do", start: "18:30", end: "19:30", stage: "Mainstage" },
		]),
		artist("Closer", [
			{ day: "do", start: "23:20", end: "01:10", stage: "Schepper", order: 2 },
		]),
	]);

	it("is 'before' ahead of the first set and names what comes next", () => {
		const state = liveState(days, at("2026-08-13T16:00:00"));
		expect(state.phase).toBe("before");
		expect(state.current).toHaveLength(0);
		expect(state.next.map((slot) => slot.title)).toEqual(["Opener"]);
	});

	it("reports the set that is playing", () => {
		const state = liveState(days, at("2026-08-13T18:00:00"));
		expect(state.phase).toBe("during");
		expect(state.current.map((slot) => slot.title)).toEqual(["Opener"]);
		expect(state.next.map((slot) => slot.title)).toEqual(["Headliner"]);
		expect(state.activeDay?.dayIndex).toBe(1);
	});

	it("reports a changeover as 'during' with nothing playing", () => {
		const state = liveState(days, at("2026-08-13T18:20:00"));
		expect(state.phase).toBe("during");
		expect(state.current).toHaveLength(0);
		expect(state.next.map((slot) => slot.title)).toEqual(["Headliner"]);
	});

	it("treats a set's boundaries as start-inclusive and end-exclusive", () => {
		expect(
			liveState(days, at("2026-08-13T17:30:00")).current.map((s) => s.title),
		).toEqual(["Opener"]);
		// at 18:15 the opener is over and nothing has taken over yet
		expect(liveState(days, at("2026-08-13T18:15:00")).current).toHaveLength(0);
	});

	it("stays live past midnight for a set that runs into the morning", () => {
		const state = liveState(days, at("2026-08-14T00:30:00"));
		expect(state.phase).toBe("during");
		expect(state.current.map((slot) => slot.title)).toEqual(["Closer"]);
	});

	it("is 'after' once the last set has ended", () => {
		const state = liveState(days, at("2026-08-14T01:10:00"));
		expect(state.phase).toBe("after");
		expect(state.current).toHaveLength(0);
		expect(state.next).toHaveLength(0);
	});

	it("groups acts that open simultaneously into one 'next' rather than a queue", () => {
		const parallel = schedule([
			artist("A", [
				{ day: "do", start: "20:00", end: "21:00", stage: "M", order: 0 },
			]),
			artist("B", [
				{ day: "do", start: "20:00", end: "21:00", stage: "T", order: 1 },
			]),
			artist("C", [
				{ day: "do", start: "21:00", end: "22:00", stage: "M", order: 0 },
			]),
		]);
		const state = liveState(parallel, at("2026-08-13T19:00:00"));
		expect(state.next.map((slot) => slot.title)).toEqual(["A", "B"]);
	});

	it("survives an empty programme", () => {
		const state = liveState(schedule([]), at("2026-08-13T20:00:00"));
		expect(state).toEqual({
			phase: "before",
			current: [],
			next: [],
			activeDay: null,
		});
	});
});

describe("progress helpers", () => {
	const [thursday] = schedule([
		artist("Act", [{ day: "do", start: "20:00", end: "21:00", stage: "M" }]),
	]);
	const slot = thursday.slots[0];

	it("reports how far through a set the clock is", () => {
		expect(slotProgress(slot, at("2026-08-13T20:15:00"))).toBeCloseTo(0.25);
		expect(slotProgress(slot, at("2026-08-13T20:30:00"))).toBeCloseTo(0.5);
	});

	it("clamps outside the set so it is always renderable", () => {
		expect(slotProgress(slot, at("2026-08-13T10:00:00"))).toBe(0);
		expect(slotProgress(slot, at("2026-08-14T10:00:00"))).toBe(1);
	});

	it("rounds minutes up, and never below zero", () => {
		expect(
			minutesUntil(at("2026-08-13T20:00:00"), at("2026-08-13T19:58:30")),
		).toBe(2);
		expect(
			minutesUntil(at("2026-08-13T20:00:00"), at("2026-08-13T21:00:00")),
		).toBe(0);
	});
});

describe("railHeightRem", () => {
	it("makes a longer set a taller row", () => {
		expect(railHeightRem(90)).toBeGreaterThan(railHeightRem(45));
	});

	it("clamps both ends so no set is unreadable or takes over the page", () => {
		expect(railHeightRem(15)).toBe(railHeightRem(30));
		expect(railHeightRem(120)).toBe(railHeightRem(300));
	});
});
