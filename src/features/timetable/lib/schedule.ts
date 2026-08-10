import type {
	ArtistCard,
	FestivalDay,
	Performance,
} from "#/features/lineup/types";
import type { Workshop } from "#/features/workshops/types";
import { site } from "#/lib/site";

/**
 * Resolving the running order to real instants.
 *
 * The CMS stores a set as a festival day (`do`/`fr`/`sa`) plus wall-clock
 * `start`/`end` strings, because that is how the programme is actually written
 * down and how editors think: "Freitag, 01:15". Turning that into an instant
 * needs two rules, both encoded here and nowhere else:
 *
 *  1. A time before 06:00 belongs to the *night* of its festival day, so it
 *     falls on the next calendar date — Thursday 01:10 is Friday morning.
 *  2. If a set's end lands at or before its start, it ran past midnight.
 *
 * The offset is hardcoded to CEST. These are three fixed days in August, so a
 * timezone database would buy nothing, and a fixed offset means every instant is
 * exact no matter what timezone the phone looking at the page is in. Displayed
 * times always come from the stored strings — never from `toLocaleTimeString`,
 * which would show festival times in the viewer's zone.
 */
const CEST = "+02:00";
const NIGHT_ROLLOVER_HOUR = 6;
const DAY_MS = 86_400_000;
const MINUTE_MS = 60_000;

export const FESTIVAL_DAYS = [
	{ day: "do", date: "2026-08-13" },
	{ day: "fr", date: "2026-08-14" },
	{ day: "sa", date: "2026-08-15" },
] as const satisfies readonly { day: FestivalDay; date: string }[];

/** Berlin-local midnight that a festival day's wall clock counts from. */
function midnight(date: string) {
	return Date.parse(`${date}T00:00:00${CEST}`);
}

function minutesSinceMidnight(clock: string) {
	const [hours, minutes] = clock.split(":");
	return Number(hours) * 60 + Number(minutes);
}

function instant(date: string, clock: string) {
	const minutes = minutesSinceMidnight(clock);
	const rolled =
		minutes < NIGHT_ROLLOVER_HOUR * 60 ? minutes + 24 * 60 : minutes;
	return midnight(date) + rolled * MINUTE_MS;
}

/**
 * Workshops publish a start and nothing else — they run until they run out. The
 * timetable still needs an end in order to know which one is currently on, so it
 * assumes an hour. Everything downstream can tell that the end was assumed
 * (`durationMin` is null) and must not present it as fact: no progress bar, no
 * "35 min left", no end time in the row.
 */
export const ASSUMED_WORKSHOP_MIN = 60;

export type SlotKind = "act" | "workshop";

export type Slot = {
	/** stable across renders and unique within the festival */
	key: string;
	kind: SlotKind;
	day: FestivalDay;
	title: string;
	/** artist detail page to link to; workshops have no page of their own */
	artistSlug: string | null;
	/** genres, for acts */
	tags: string[];
	image: ArtistCard["image"];
	/** the stage an act plays; workshops are always in the Workshop-Zelt */
	stage: NonNullable<Performance["stage"]> | null;
	/** wall clock, exactly as stored — safe to render verbatim */
	start: string;
	/** null when only a start is published, i.e. for workshops */
	end: string | null;
	startAt: number;
	/** assumed rather than published when `end` is null */
	endAt: number;
	/** null when the end was assumed, so nothing can quote a made-up duration */
	durationMin: number | null;
};

export type DaySchedule = {
	day: FestivalDay;
	date: string;
	slots: Slot[];
	/** programme placed on this day whose time is not fixed yet */
	pending: { key: string; title: string; artistSlug: string | null }[];
	startAt: number;
	endAt: number;
};

// Acts before workshops when both start on the same minute: the music is the
// headline programme, the workshop is the thing you could also be doing.
const KIND_RANK: Record<SlotKind, number> = { act: 0, workshop: 1 };

/**
 * Flattens artists and workshops into one chronological list per festival day.
 *
 * The music runs strictly in sequence — one stage hands over to the next rather
 * than three playing at once — so a day is a single ordered river of sets, not a
 * three-column grid. Workshops, on the other hand, genuinely overlap it: the
 * Friday and Saturday daytime workshops run alongside the Turtle. They go on the
 * same rail rather than in a lane of their own, because eight workshops do not
 * justify a second column, and a column that is empty two thirds of the time is
 * exactly what made a per-stage grid the wrong answer for the music.
 *
 * Ordering is deterministic all the way down (time, then kind, then stage, then
 * title) so the page never reshuffles between renders.
 */
export function buildSchedule(
	artists: ArtistCard[],
	workshops: Workshop[] = [],
): DaySchedule[] {
	return FESTIVAL_DAYS.map(({ day, date }) => {
		const slots: Slot[] = [];
		const pending: DaySchedule["pending"] = [];

		const place = (
			slot: Omit<Slot, "startAt" | "endAt" | "durationMin">,
			end: string | null,
		) => {
			const startAt = instant(date, slot.start);
			if (end === null) {
				slots.push({
					...slot,
					startAt,
					endAt: startAt + ASSUMED_WORKSHOP_MIN * MINUTE_MS,
					durationMin: null,
				});
				return;
			}
			let endAt = instant(date, end);
			// a set that ends at or before it starts ran through midnight
			if (endAt <= startAt) endAt += DAY_MS;
			slots.push({
				...slot,
				startAt,
				endAt,
				durationMin: Math.round((endAt - startAt) / MINUTE_MS),
			});
		};

		for (const artist of artists) {
			for (const [index, performance] of (
				artist.performances ?? []
			).entries()) {
				if (performance.day !== day) continue;
				const key = `act-${artist.slug}-${index}`;
				if (!performance.start || !performance.end) {
					pending.push({ key, title: artist.name, artistSlug: artist.slug });
					continue;
				}
				place(
					{
						key,
						kind: "act",
						day,
						title: artist.name,
						artistSlug: artist.slug,
						tags: artist.genres ?? [],
						image: artist.image,
						stage: performance.stage ?? null,
						start: performance.start,
						end: performance.end,
					},
					performance.end,
				);
			}
		}

		for (const workshop of workshops) {
			if (workshop.day !== day) continue;
			const key = `workshop-${workshop.slug}`;
			if (!workshop.start) {
				pending.push({ key, title: workshop.title, artistSlug: null });
				continue;
			}
			place(
				{
					key,
					kind: "workshop",
					day,
					title: workshop.title,
					artistSlug: null,
					tags: [],
					image: null,
					stage: null,
					start: workshop.start,
					end: null,
				},
				null,
			);
		}

		slots.sort(
			(a, b) =>
				a.startAt - b.startAt ||
				KIND_RANK[a.kind] - KIND_RANK[b.kind] ||
				(a.stage?.order ?? 0) - (b.stage?.order ?? 0) ||
				a.title.localeCompare(b.title),
		);
		pending.sort((a, b) => a.title.localeCompare(b.title));

		return {
			day,
			date,
			slots,
			pending,
			startAt: slots[0]?.startAt ?? midnight(date),
			// not slots.at(-1)!.endAt: the last set to *start* is not necessarily
			// the last to finish once sets overlap
			endAt: slots.reduce((latest, slot) => Math.max(latest, slot.endAt), 0),
		};
	});
}

/**
 * The window in which the site switches from "counting down" to "we are live".
 *
 * Deliberately independent of CMS data so the homepage can decide what to render
 * before any query resolves: it opens when the gates do (`site.festivalStart`)
 * and closes at 06:00 on the morning after the last night, an hour past the last
 * set. Sunday is teardown only.
 */
export const FESTIVAL_MODE = {
	start: Date.parse(site.festivalStart),
	end:
		midnight(FESTIVAL_DAYS[FESTIVAL_DAYS.length - 1].date) +
		DAY_MS +
		NIGHT_ROLLOVER_HOUR * 60 * MINUTE_MS,
} as const;

export function isFestivalMode(now: number) {
	return now >= FESTIVAL_MODE.start && now < FESTIVAL_MODE.end;
}

/**
 * Pins the page's clock to a given moment, for previewing the live layer.
 *
 * The whole live experience only exists for three days in August, which is far
 * too late to find out it is wrong — `/timetable?t=2026-08-14T22:45` renders the
 * page exactly as it will look then. Accepts a festival-local wall clock
 * (`YYYY-MM-DDTHH:MM`) and returns null for anything it cannot parse, so a
 * mangled link just shows the ordinary page.
 */
export function parsePreviewInstant(value: string | undefined) {
	if (!value || !/^\d{4}-\d{2}-\d{2}T[0-2]\d:[0-5]\d$/.test(value)) return null;
	const parsed = Date.parse(`${value}:00${CEST}`);
	return Number.isNaN(parsed) ? null : parsed;
}

export type LiveState = {
	/** where `now` sits relative to the whole festival */
	phase: "before" | "during" | "after";
	/** every set playing at this moment — usually one, more if stages overlap */
	current: Slot[];
	/** the sets that start next, all sharing the same earliest start time */
	next: Slot[];
	/** the day whose programme is running, or the next one that will */
	activeDay: DaySchedule | null;
};

const MAX_NEXT = 3;

export function liveState(days: DaySchedule[], now: number): LiveState {
	const slots = days.flatMap((day) => day.slots);
	if (slots.length === 0) {
		return { phase: "before", current: [], next: [], activeDay: null };
	}

	// already sorted by kind then stage from buildSchedule, so an act always comes
	// before a workshop running at the same time
	const current = slots.filter(
		(slot) => slot.startAt <= now && now < slot.endAt,
	);

	const upcoming = slots
		.filter((slot) => slot.startAt > now)
		.sort((a, b) => a.startAt - b.startAt);
	// everything sharing the earliest start goes in together, so two acts opening
	// simultaneously are never presented as "this one, then that one"
	const nextStart = upcoming[0]?.startAt;
	const next = upcoming
		.filter((slot) => slot.startAt === nextStart)
		.slice(0, MAX_NEXT);

	const lastEnd = slots.reduce(
		(latest, slot) => Math.max(latest, slot.endAt),
		0,
	);
	const phase =
		now < slots[0].startAt ? "before" : now >= lastEnd ? "after" : "during";

	const activeDay =
		days.find((day) => day.slots.some((slot) => current.includes(slot))) ??
		days.find((day) => day.endAt > now) ??
		null;

	return { phase, current, next, activeDay };
}

/**
 * Where the page should scroll to for "now": what is playing, else what starts
 * next. Prefers an act over a concurrent workshop — the music is what somebody
 * opening the timetable mid-festival is looking for, and the workshop is one row
 * away on the same rail anyway.
 */
export function focusSlot(state: LiveState): Slot | null {
	const pool = state.current.length > 0 ? state.current : state.next;
	return pool.find((slot) => slot.kind === "act") ?? pool[0] ?? null;
}

/**
 * How far through a set `now` is, as 0–1. Clamped, so it is safe to render.
 *
 * Null when the slot's end was assumed rather than published: drawing a progress
 * bar over a guessed hour would present a guess as a measurement.
 */
export function slotProgress(slot: Slot, now: number) {
	if (slot.durationMin === null) return null;
	const span = slot.endAt - slot.startAt;
	if (span <= 0) return 0;
	return Math.min(1, Math.max(0, (now - slot.startAt) / span));
}

export function minutesUntil(timestamp: number, now: number) {
	return Math.max(0, Math.ceil((timestamp - now) / MINUTE_MS));
}

/** Null for an assumed end — see `slotProgress`. */
export function minutesLeft(slot: Slot, now: number) {
	return slot.durationMin === null ? null : minutesUntil(slot.endAt, now);
}

/**
 * Row height in rem, scaled by how long the set runs.
 *
 * The whole point of a proportional rail is that a 110-minute closing set
 * *looks* longer than a 30-minute opener, so the shape of the night is legible
 * at a glance. Clamped hard at both ends: below the floor a short set has no
 * room for its own name, and above the ceiling one long set would push the rest
 * of the day off-screen. The mapping is intentionally sub-linear in effect —
 * 30 min → floor, 120 min → ceiling — so it reads as emphasis, not as a chart.
 */
export function railHeightRem(durationMin: number | null) {
	const MIN = 5.5;
	const MAX = 11;
	// An assumed hour is not a measurement, so it must not be drawn as one: an
	// open-ended slot always gets the floor height
	if (durationMin === null) return MIN;
	return Math.min(MAX, Math.max(MIN, 3.5 + durationMin * 0.0625));
}
