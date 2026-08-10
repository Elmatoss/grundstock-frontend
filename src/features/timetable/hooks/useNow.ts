import { useEffect, useState } from "react";

/**
 * A ticking clock that stays `null` until the component has mounted.
 *
 * The server has no business rendering "now": whatever instant it picked would
 * differ from the client's on hydration, and unlike a countdown's digits the
 * difference here is structural — a different act could be highlighted as live,
 * which React cannot reconcile with `suppressHydrationWarning`.
 *
 * So the first client render matches the server exactly (`null` — the schedule
 * renders complete but with nothing marked live, which is also what a visitor
 * without JS gets and what search engines index), and the live layer arrives in
 * an effect right after. Callers treat `null` as "not live yet".
 *
 * Default cadence is 15s. Everything on the page is expressed in whole minutes,
 * so a faster tick would re-render the tree for no visible change; the "now" line
 * is CSS-transitioned between ticks, so it still glides rather than jumps.
 */
export function useNow(intervalMs = 15_000, override?: number | null) {
	const [now, setNow] = useState<number | null>(null);

	useEffect(() => {
		if (override != null) return;
		setNow(Date.now());
		const id = setInterval(() => setNow(Date.now()), intervalMs);
		return () => clearInterval(id);
	}, [intervalMs, override]);

	// A pinned instant is deterministic, so unlike the real clock it is safe to
	// render on the server too — see the `?t=` preview on the timetable route
	return override ?? now;
}
