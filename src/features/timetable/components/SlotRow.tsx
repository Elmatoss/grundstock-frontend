import { Link } from "@tanstack/react-router";
import { sanityImageProps } from "#/lib/sanity";
import { m } from "#/paraglide/messages";
import { slotDomId } from "../hooks/useScrollToNow";
import { spanLabel } from "../lib/format";
import {
	minutesLeft,
	railHeightRem,
	type Slot,
	slotProgress,
} from "../lib/schedule";

export type SlotState = "past" | "live" | "upcoming";

/** Below this, counting the minutes down is more anxious than useful. */
const WRAPPING_UP_MIN = 5;

/**
 * One entry on the rail: its time on the left, a dot on the hairline, what is
 * happening on the right. Row height scales with how long a set runs (see
 * `railHeightRem`), which is what makes a two-hour closing slot read as longer
 * than a half-hour opener without anything having to say so.
 *
 * Three states, and the hierarchy between them is carried by colour temperature
 * rather than by opacity: live is amber and large, upcoming is moon with an amber
 * genre line, past is fully legible but drained of every amber accent. Past reads
 * as *behind you* that way, where dimming it to grey read as *unavailable* — and
 * at 02:00 the most common question is still who played earlier.
 */
export function SlotRow({
	slot,
	state,
	now,
}: {
	slot: Slot;
	state: SlotState;
	/** null until the clock has mounted — then the live layer is allowed to show */
	now: number | null;
}) {
	const live = state === "live";
	const past = state === "past";
	const workshop = slot.kind === "workshop";
	// null for a workshop: its end is an assumption, so there is no honest
	// progress to draw and no honest number of minutes to quote
	const progress = live && now !== null ? slotProgress(slot, now) : null;
	const left = live && now !== null ? minutesLeft(slot, now) : null;

	return (
		<div
			id={slotDomId(slot)}
			className="tt-row tt-reveal relative"
			style={{ minHeight: `${railHeightRem(slot.durationMin)}rem` }}
		>
			{/* Times come from the stored wall-clock strings, never reformatted from an
			    instant — these are festival times, not the viewer's local times */}
			<div className="pt-0.5 pr-2 text-right sm:pr-3">
				<time
					dateTime={new Date(slot.startAt).toISOString()}
					className={`block text-sm font-semibold tabular-nums sm:text-base ${
						live ? "text-glow" : past ? "text-moon-dim/75" : "text-moon"
					}`}
				>
					{slot.start}
				</time>
				{slot.end ? (
					<span
						className={`mt-0.5 block text-xs tabular-nums ${
							past ? "text-moon-dim/50" : "text-moon-dim/70"
						}`}
					>
						{slot.end}
					</span>
				) : (
					<span
						aria-hidden="true"
						className="mt-0.5 block text-xs text-moon-dim/40"
					>
						···
					</span>
				)}
			</div>

			{/* On a live act the rail *is* the now-indicator: lit amber down to exactly
			    how far through the set we are, ending in a pulsing dot. That reads as
			    the night having flowed this far, and avoids a separate marker line
			    cutting across the card. A live workshop only gets the dot, because
			    there is no measured position to light the rail to. */}
			<div className={`relative tt-rail ${past ? "tt-rail-past" : ""}`}>
				{live && progress !== null && (
					<span
						aria-hidden="true"
						className="tt-progress-fill absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-glow"
						style={{ "--tt-progress": progress } as React.CSSProperties}
					/>
				)}
				<span
					aria-hidden="true"
					className={
						live
							? `tt-now tt-now-dot absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${workshop ? "border-2 border-glow bg-night" : "bg-glow"}`
							: `absolute top-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full ${
									workshop
										? `border bg-night ${past ? "border-moon-dim/40" : "border-moon-dim"}`
										: past
											? "bg-moon-dim/45"
											: "bg-moon-dim/70"
								}`
					}
					style={
						live && progress !== null
							? { top: `${progress * 100}%` }
							: live
								? { top: "0.375rem" }
								: undefined
					}
				/>
			</div>

			<SlotBody slot={slot} state={state}>
				{live && (
					<span
						className={`mb-1 block text-[0.625rem] font-semibold tracking-[0.22em] text-glow uppercase`}
					>
						{workshop ? m.timetable_workshop_now() : m.timetable_now_label()}
					</span>
				)}
				{/* The live row is now the only place "what's on" is stated — the page
				    used to carry a card up top — so it gets a size bump too */}
				<h3
					className={`m-0 font-display leading-tight transition-colors ${
						live
							? "text-xl text-glow-soft sm:text-3xl"
							: past
								? "text-lg text-moon-dim sm:text-2xl"
								: "text-lg text-moon group-hover:text-glow-soft sm:text-2xl"
					}`}
				>
					{slot.title}
				</h3>

				<p className="mt-1 mb-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-moon-dim">
					{workshop && (
						<span
							className={`rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold tracking-[0.16em] uppercase ${
								past
									? "border-moon-dim/25 text-moon-dim/60"
									: "border-moon-dim/45 text-moon-dim"
							}`}
						>
							{m.timetable_workshop_tag()}
						</span>
					)}
					{slot.tags.length > 0 && (
						<span className={past ? "text-moon-dim/60" : "text-glow-soft/75"}>
							{slot.tags.join(" · ")}
						</span>
					)}
					{slot.durationMin !== null ? (
						<span className="tabular-nums">{spanLabel(slot.durationMin)}</span>
					) : (
						<span className="tabular-nums">
							{m.timetable_open_start({ time: slot.start })}
						</span>
					)}
				</p>

				{live && progress !== null && left !== null && (
					<div className="mt-2.5 flex items-center gap-2.5">
						<div
							className="h-0.5 flex-1 overflow-hidden rounded-full bg-moon-dim/20"
							role="progressbar"
							aria-label={m.timetable_progress_label()}
							aria-valuenow={Math.round(progress * 100)}
							aria-valuemin={0}
							aria-valuemax={100}
						>
							<div
								className="tt-progress-fill h-full w-full bg-glow"
								style={{ "--tt-progress": progress } as React.CSSProperties}
							/>
						</div>
						<span className="shrink-0 text-xs font-semibold text-glow tabular-nums">
							{left <= WRAPPING_UP_MIN
								? m.timetable_last_minutes()
								: m.timetable_minutes_left({ span: spanLabel(left) })}
						</span>
					</div>
				)}
			</SlotBody>
		</div>
	);
}

/**
 * The card. An act links to its artist page; a workshop has no page of its own,
 * so it renders as a plain block rather than as something that looks clickable
 * and then isn't. A dashed border keeps it visibly a different kind of entry.
 */
function SlotBody({
	slot,
	state,
	children,
}: {
	slot: Slot;
	state: SlotState;
	children: React.ReactNode;
}) {
	const live = state === "live";
	const past = state === "past";
	const workshop = slot.kind === "workshop";

	const shell = `group -mt-1 mb-3 flex items-start gap-3 rounded-xs px-3 py-2.5 no-underline transition-colors sm:gap-4 sm:px-4 ${
		workshop ? "border border-dashed" : "border"
	} ${
		live
			? "inner-glow border-glow/45 bg-night-soft/70"
			: past
				? "border-moon-dim/12"
				: workshop
					? "border-moon-dim/25 hover:border-moon-dim/45"
					: "border-transparent hover:border-border hover:bg-night-soft/40"
	}`;

	const body = (
		<>
			<div className="min-w-0 flex-1">{children}</div>
			{slot.image && (
				<img
					{...sanityImageProps(slot.image, 72, 72)}
					sizes="72px"
					alt=""
					loading="lazy"
					className={`hidden size-14 shrink-0 rounded-xs object-cover transition-[filter,opacity] sm:block sm:size-18 ${
						past ? "opacity-70 saturate-50" : "group-hover:brightness-110"
					}`}
				/>
			)}
		</>
	);

	if (!slot.artistSlug) {
		return (
			<div className={shell} aria-current={live ? "time" : undefined}>
				{body}
			</div>
		);
	}

	return (
		<Link
			to="/artists/$slug"
			params={{ slug: slot.artistSlug }}
			aria-current={live ? "time" : undefined}
			className={shell}
		>
			{body}
		</Link>
	);
}

/**
 * The handover between stages. Because the music is sequential, this is not a
 * column header but a moment in the evening — "the night moves indoors" — so it
 * gets a full-width rule with the stage name and its tagline rather than sitting
 * quietly next to each act.
 */
export function StageMarker({
	stage,
	tagline,
}: {
	stage: string;
	tagline?: string;
}) {
	return (
		<div className="tt-row tt-reveal relative pt-7 pb-2 first:pt-1">
			<div />
			<div className="tt-rail relative" />
			<div className="flex min-w-0 items-center gap-3 px-3 sm:px-4">
				<span aria-hidden="true" className="text-xs text-glow">
					◆
				</span>
				<h3 className="m-0 text-xs font-semibold tracking-[0.22em] text-glow uppercase">
					{stage}
				</h3>
				{tagline && (
					<span className="hidden truncate text-xs text-moon-dim/70 sm:block">
						{tagline}
					</span>
				)}
				<span
					aria-hidden="true"
					className="h-px flex-1 bg-linear-to-r from-glow/35 to-transparent"
				/>
			</div>
		</div>
	);
}
