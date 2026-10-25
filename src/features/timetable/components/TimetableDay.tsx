import { Link } from "@tanstack/react-router";
import { localized } from "#/lib/sanity";
import { m } from "#/paraglide/messages";
import { dayDateLabel, dayLabel } from "../lib/format";
import type { DaySchedule } from "../lib/schedule";
import { SlotRow, type SlotState, StageMarker } from "./SlotRow";

/** Anchor for a programme day. Numbered, since the weekday now varies by year. */
export function dayAnchor(dayIndex: number) {
	return `tag-${dayIndex}`;
}

/** Slug of the stage of the most recent act before `index`, if any. */
function lastActStage(schedule: DaySchedule, index: number) {
	for (let i = index - 1; i >= 0; i--) {
		const stage = schedule.slots[i].stage;
		if (stage) return stage.slug;
	}
	return null;
}

/**
 * One festival day as a single chronological rail.
 *
 * Every day is always rendered — the whole programme has to be readable in one
 * scroll, so there are no tabs that hide most of it. The day headers
 * stick under the site header instead, which keeps you oriented while scrolling
 * through a night that runs to 05:00.
 */
export function TimetableDay({
	schedule,
	now,
}: {
	schedule: DaySchedule;
	/** null until the clock has mounted; then the live layer may render */
	now: number | null;
}) {
	const inProgress =
		now !== null && now >= schedule.startAt && now < schedule.endAt;

	function stateOf(startAt: number, endAt: number): SlotState {
		if (now === null) return "upcoming";
		if (now >= endAt) return "past";
		if (now >= startAt) return "live";
		return "upcoming";
	}

	// Where the gap marker goes when the clock falls into a changeover: before the
	// next set to start, provided nothing is playing right now.
	const gapBefore =
		now !== null &&
		inProgress &&
		!schedule.slots.some((slot) => stateOf(slot.startAt, slot.endAt) === "live")
			? schedule.slots.findIndex((slot) => slot.startAt > now)
			: -1;

	return (
		<section
			id={dayAnchor(schedule.dayIndex)}
			aria-labelledby={`${dayAnchor(schedule.dayIndex)}-heading`}
			className="tt-day scroll-mt-[calc(var(--header-height)+1rem)]"
		>
			<header className="sticky top-(--header-height) z-30 -mx-4 flex items-baseline gap-3 border-b border-border bg-night/85 px-4 py-3 backdrop-blur-md">
				<h2
					id={`${dayAnchor(schedule.dayIndex)}-heading`}
					className="m-0 font-display text-2xl text-moon sm:text-3xl"
				>
					{dayLabel(schedule.date)}
				</h2>
				<span className="text-xs tracking-widest text-moon-dim uppercase">
					{dayDateLabel(schedule.date)}
				</span>
				{inProgress && (
					<span className="ml-auto flex items-center gap-2 text-[0.625rem] font-semibold tracking-[0.22em] text-glow uppercase">
						<span
							aria-hidden="true"
							className="tt-now-dot size-1.5 rounded-full bg-glow"
						/>
						{m.timetable_now_marker()}
					</span>
				)}
			</header>

			<div className="relative pt-2">
				{/* The ember drifting down the rail. Only on a day that is actually
				    running — on the other two it would suggest activity that isn't. */}
				{inProgress && (
					<span
						aria-hidden="true"
						className="tt-drift tt-rail-x absolute top-0 -translate-x-1/2"
					/>
				)}

				{schedule.slots.map((slot, index) => {
					// Compared against the last *act*, not the previous row: a workshop
					// sitting between two Turtle sets has no stage, so comparing with its
					// immediate predecessor would announce "Turtle" all over again on the
					// far side of it.
					const stageChanged =
						slot.stage != null &&
						slot.stage.slug !== lastActStage(schedule, index);
					return (
						<div key={slot.key}>
							{stageChanged && slot.stage && (
								<StageMarker
									stage={slot.stage.name}
									tagline={localized(slot.stage.tagline) || undefined}
								/>
							)}
							{index === gapBefore && <GapMarker nextStart={slot.start} />}
							<SlotRow
								slot={slot}
								state={stateOf(slot.startAt, slot.endAt)}
								now={now}
							/>
						</div>
					);
				})}

				{schedule.pending.length > 0 && (
					<div className="tt-row tt-reveal relative pt-6">
						<div className="pt-1 pr-2 text-right text-xs text-moon-dim/70 sm:pr-3">
							✳
						</div>
						<div className="tt-rail relative" />
						<div className="px-3 sm:px-4">
							<h3 className="m-0 text-xs font-semibold tracking-[0.22em] text-moon-dim uppercase">
								{m.timetable_pending()}
							</h3>
							<ul className="mt-2 mb-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
								{schedule.pending.map(({ key, title, artistSlug }) => (
									<li key={key}>
										{artistSlug ? (
											<Link
												to="/artists/$slug"
												params={{ slug: artistSlug }}
												className="font-display text-lg text-moon no-underline transition-colors hover:text-glow-soft"
											>
												{title}
											</Link>
										) : (
											// a workshop has no page of its own to link to
											<span className="font-display text-lg text-moon-dim">
												{title}
											</span>
										)}
									</li>
								))}
							</ul>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}

/** The clock is in a changeover — nothing is playing, the rail waits. */
function GapMarker({ nextStart }: { nextStart: string }) {
	return (
		<div className="tt-row relative py-1">
			<div className="pr-2 text-right sm:pr-3">
				<span className="text-[0.625rem] font-semibold tracking-[0.18em] text-glow uppercase">
					{m.timetable_now_marker()}
				</span>
			</div>
			<div className="tt-rail relative">
				<span
					aria-hidden="true"
					className="tt-now-dot absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow"
				/>
			</div>
			<div className="flex items-center gap-3 px-3 sm:px-4">
				<span
					aria-hidden="true"
					className="h-px w-8 bg-linear-to-r from-glow/60 to-transparent"
				/>
				<span className="text-xs text-moon-dim">
					{m.timetable_break_text({ time: nextStart })}
				</span>
			</div>
		</div>
	);
}
