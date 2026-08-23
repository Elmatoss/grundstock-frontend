import { useEffect, useState } from "react";
import { m } from "#/paraglide/messages";

export function splitCountdown(ms: number) {
	const total = Math.floor(ms / 1000);
	return {
		days: Math.floor(total / 86400),
		hours: Math.floor((total % 86400) / 3600),
		minutes: Math.floor((total % 3600) / 60),
		seconds: total % 60,
	};
}

/**
 * @param target instant the festival opens, from the edition's `from`
 * @param pinnedNow freezes the clock for the `?t=` preview, so a review of the
 *   countdown out of season shows real digits instead of a run-down zero
 */
export function Countdown({
	target,
	pinnedNow,
}: {
	target: number;
	pinnedNow?: number | null;
}) {
	const [ms, setMs] = useState(() =>
		Math.max(0, target - (pinnedNow ?? Date.now())),
	);

	useEffect(() => {
		if (pinnedNow != null) {
			setMs(Math.max(0, target - pinnedNow));
			return;
		}
		const tick = () => setMs(Math.max(0, target - Date.now()));
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, [target, pinnedNow]);

	if (ms === 0) {
		return (
			<p className="m-0 font-display text-2xl text-glow">
				{m.countdown_live()}
			</p>
		);
	}

	const parts = splitCountdown(ms);
	const cells = [
		[parts.days, m.countdown_days()],
		[parts.hours, m.countdown_hours()],
		[parts.minutes, m.countdown_minutes()],
		[parts.seconds, m.countdown_seconds()],
	] as const;

	return (
		<div className="flex items-start justify-center gap-4 sm:gap-6">
			{cells.map(([value, label]) => (
				<div key={label} className="flex w-16 flex-col items-center sm:w-20">
					{/* seconds differ between server render and hydration — expected */}
					{/* Sans, not the display serif: Instrument Serif has no tabular-figure
					    feature, so tabular-nums would no-op there and the ticking seconds
					    would shift the layout every second */}
					<span
						suppressHydrationWarning
						className="text-3xl font-semibold text-moon tabular-nums sm:text-4xl"
					>
						{String(value).padStart(2, "0")}
					</span>
					<span className="mt-1 text-xs tracking-widest text-moon-dim uppercase">
						{label}
					</span>
				</div>
			))}
		</div>
	);
}
