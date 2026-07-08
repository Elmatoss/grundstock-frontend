import { useEffect, useState } from "react";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

const TARGET = new Date(site.festivalStart).getTime();

function remaining() {
	return Math.max(0, TARGET - Date.now());
}

export function splitCountdown(ms: number) {
	const total = Math.floor(ms / 1000);
	return {
		days: Math.floor(total / 86400),
		hours: Math.floor((total % 86400) / 3600),
		minutes: Math.floor((total % 3600) / 60),
		seconds: total % 60,
	};
}

export function Countdown() {
	const [ms, setMs] = useState(remaining);

	useEffect(() => {
		const id = setInterval(() => setMs(remaining()), 1000);
		return () => clearInterval(id);
	}, []);

	if (ms === 0) {
		return (
			<p className="m-0 font-display text-2xl font-bold text-glow">
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
					<span
						suppressHydrationWarning
						className="font-display text-3xl font-bold text-moon tabular-nums sm:text-4xl"
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
