import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
	FestivalOver,
	FestivalTba,
} from "#/features/festival/components/FestivalOver";
import { useFestival } from "#/features/festival/hooks/useFestival";
import { editionPhase } from "#/features/festival/lib/festival";
import { Countdown } from "#/features/home/components/Countdown";
import { artistListQueryOptions } from "#/features/lineup/api/artists";
import { m } from "#/paraglide/messages";
import { useNow } from "../hooks/useNow";
import { spanLabel } from "../lib/format";
import {
	buildSchedule,
	liveState,
	minutesLeft,
	minutesUntil,
	slotProgress,
} from "../lib/schedule";

/**
 * What sits in the hero, across the whole life of an edition: a countdown before
 * the festival, the live programme while it runs, a thank-you once it is over.
 *
 * The countdown is the pre-mount and no-JS state whenever there *is* something to
 * count down to, which is the right default — it needs no clock, and during the
 * festival it has already run down to "it's happening", so the swap to the live
 * card always upgrades rather than contradicts. The live card then replaces it in
 * an effect (see `useNow` for why the server must not decide this) and uses
 * `useQuery`, not the suspense variant: the hero must never block or fail on
 * Sanity being slow.
 *
 * The farewell, by contrast, needs no clock at all — it follows from there being
 * no upcoming edition — so it renders on the server and is what a visitor without
 * JS sees too.
 */
export function FestivalLive({ previewNow }: { previewNow?: number | null }) {
	const now = useNow(15_000, previewNow);
	const { upcoming, featured, isOver } = useFestival(previewNow);

	// Only the running festival needs the programme; before and after, the hero is
	// copy and a clock
	const isLive =
		upcoming !== null && now !== null && editionPhase(upcoming, now) === "live";

	const { data: artists } = useQuery({
		...artistListQueryOptions(featured?.year ?? 0),
		enabled: isLive && featured !== null,
	});

	const state = useMemo(
		() =>
			now === null || !artists || !featured
				? null
				: liveState(buildSchedule(artists, [], featured), now),
		[artists, now, featured],
	);

	if (featured === null) return <FestivalTba />;
	if (isOver) return <FestivalOver edition={featured} />;
	// `upcoming` is non-null here: featured falls back to an ended edition only
	// when isOver, which returned above
	if (!isLive || !state)
		return (
			<Countdown target={Date.parse(featured.from)} pinnedNow={previewNow} />
		);

	const current = state.current[0];
	const next = state.next[0];
	const progress = current ? slotProgress(current, now) : null;
	const left = current ? minutesLeft(current, now) : null;

	return (
		<div className="tt-panel-in flex w-full max-w-lg flex-col items-center gap-4">
			{current ? (
				<div className="w-full">
					<p className="m-0 flex items-center justify-center gap-2 text-[0.6875rem] font-semibold tracking-[0.22em] text-glow uppercase">
						<span
							aria-hidden="true"
							className="tt-now-dot size-2 rounded-full bg-glow"
						/>
						{m.timetable_now_label()}
						{current.stage && (
							<span className="text-moon-dim">· {current.stage.name}</span>
						)}
					</p>
					<p className="mt-2 mb-0 font-display text-3xl text-moon sm:text-4xl">
						{current.title}
					</p>
					{/* Both are null only for an open-ended slot, and the hero is built
					    from acts alone — but guarded rather than asserted, so it degrades
					    instead of crashing if workshops ever reach it */}
					{progress !== null && left !== null && (
						<div className="mt-3 flex items-center gap-3">
							<span className="text-xs text-moon-dim tabular-nums">
								{current.start}
							</span>
							<div className="h-0.5 flex-1 overflow-hidden rounded-full bg-moon-dim/25">
								<div
									className="tt-progress-fill h-full w-full bg-glow"
									style={{ "--tt-progress": progress } as React.CSSProperties}
								/>
							</div>
							<span className="text-xs text-glow tabular-nums">
								{m.timetable_minutes_left({ span: spanLabel(left) })}
							</span>
						</div>
					)}
				</div>
			) : (
				<p className="m-0 font-display text-2xl text-glow">
					{state.phase === "after"
						? m.timetable_after_title({ year: featured.year })
						: m.timetable_break_title()}
				</p>
			)}

			{next && (
				<p className="m-0 text-sm text-moon-dim">
					<span className="text-xs font-semibold tracking-[0.18em] uppercase">
						{m.timetable_next_label()}
					</span>{" "}
					<span className="text-moon">{next.title}</span>{" "}
					<span className="tabular-nums">
						(
						{m.timetable_starts_in({
							span: spanLabel(minutesUntil(next.startAt, now)),
						})}
						)
					</span>
				</p>
			)}

			<Link to="/timetable" className="btn btn-secondary no-underline">
				{m.timetable_cta()}
			</Link>
		</div>
	);
}
