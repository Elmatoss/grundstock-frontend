import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { artistListQueryOptions } from "#/features/lineup/api/artists";
import { workshopListQueryOptions } from "#/features/workshops/api/workshops";
import { m } from "#/paraglide/messages";
import { useNow } from "../hooks/useNow";
import {
	scrollToSlotId,
	slotDomId,
	useScrollToNow,
} from "../hooks/useScrollToNow";
import { dayDateLabel, dayLabel } from "../lib/format";
import {
	buildSchedule,
	focusSlot,
	isFestivalMode,
	liveState,
	parsePreviewInstant,
} from "../lib/schedule";
import { dayAnchor, TimetableDay } from "./TimetableDay";

// getRouteApi, not an import of the route itself: the route already imports this
// component, and importing it back would be a cycle
const route = getRouteApi("/timetable");

export function TimetablePage() {
	// Same query the lineup page uses — one cache entry, one request, and the
	// timetable is a different reading of exactly the same artist data
	const { data: artists } = useSuspenseQuery(artistListQueryOptions);
	const { data: workshops } = useSuspenseQuery(workshopListQueryOptions);
	const { t } = route.useSearch();
	const now = useNow(15_000, parsePreviewInstant(t));

	const days = useMemo(
		() => buildSchedule(artists, workshops),
		[artists, workshops],
	);
	const state = useMemo(
		() => (now === null ? null : liveState(days, now)),
		[days, now],
	);

	const hasProgramme = days.some((day) => day.slots.length > 0);
	const liveDay =
		state?.phase === "during" ? (state.activeDay?.day ?? null) : null;

	// Where "now" is on the rail: whatever is playing, or — during a changeover or
	// before the first act of the day — whatever is about to start.
	const focus = state ? focusSlot(state) : null;
	const focusId = focus ? slotDomId(focus) : null;
	const canJumpToNow = now !== null && isFestivalMode(now) && focusId !== null;

	useScrollToNow(focusId, canJumpToNow);

	return (
		<main className="page-wrap flex-1 py-16 sm:py-20">
			<p className="m-0 text-xs font-semibold tracking-[0.25em] text-glow uppercase">
				{m.timetable_kicker()}
			</p>
			<h1 className="mt-2 mb-0 font-display text-4xl text-moon sm:text-5xl">
				{m.timetable_title()}
			</h1>
			<p className="mt-4 mb-0 max-w-2xl text-moon-dim">{m.timetable_intro()}</p>

			{!hasProgramme ? (
				<p className="mt-10 inline-block badge">{m.timetable_empty()}</p>
			) : (
				<>
					{/* Jump links, not tabs: the whole programme stays on the page and
					    these only scroll to it. `now` gating keeps the server and the
					    first client render identical. */}
					<nav
						aria-label={m.timetable_jump_label()}
						className="mt-10 flex flex-wrap items-center gap-2"
					>
						{/* The way back after scrolling off to another day. The page already
						    travelled here on open, so this is a return trip, not the
						    primary path. */}
						{canJumpToNow && focusId && (
							<button
								type="button"
								onClick={() => scrollToSlotId(focusId, true)}
								className="btn btn-quiet text-glow"
							>
								<span
									aria-hidden="true"
									className="tt-now-dot size-1.5 rounded-full bg-glow"
								/>
								{m.timetable_jump_now()}
							</button>
						)}
						{days.map((day) => (
							<a
								key={day.day}
								href={`#${dayAnchor(day.day)}`}
								className={`btn btn-quiet no-underline ${
									day.day === liveDay ? "text-glow" : ""
								}`}
							>
								{day.day === liveDay && (
									<span
										aria-hidden="true"
										className="tt-now-dot size-1.5 rounded-full bg-glow"
									/>
								)}
								{dayLabel(day.day)}
								<span className="hidden text-moon-dim sm:inline">
									{dayDateLabel(day.date)}
								</span>
							</a>
						))}
						<Link to="/lineup" className="btn btn-quiet ml-auto no-underline">
							{m.timetable_lineup_cta()}
						</Link>
					</nav>

					<div className="mt-6 grid gap-12 sm:gap-16">
						{days
							.filter((day) => day.slots.length > 0 || day.pending.length > 0)
							.map((day) => (
								<TimetableDay key={day.day} schedule={day} now={now} />
							))}
					</div>
				</>
			)}
		</main>
	);
}
