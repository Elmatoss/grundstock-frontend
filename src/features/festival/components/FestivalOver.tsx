import { m } from "#/paraglide/messages";
import type { Edition } from "../types";

/**
 * What the hero says once the festival is over and no new year is announced.
 *
 * This is the state the site sat in wrongly for a week: the countdown had run
 * down to zero and kept insisting "Es ist so weit!" because nothing existed past
 * the end of the festival. It replaces the countdown rather than the programme —
 * the lineup, workshops and running order all stay on the site until a new
 * edition takes their place.
 *
 * The thank-you is a translated string rather than a CMS field: it is the site
 * speaking in its own voice, and it says the same thing every year. Only the year
 * in the heading changes.
 */
export function FestivalOver({ edition }: { edition: Edition }) {
	return (
		<div className="tt-panel-in flex w-full max-w-lg flex-col items-center gap-3 text-center">
			<p className="m-0 font-display text-2xl text-glow sm:text-3xl">
				{m.festival_over_title({ year: edition.year })}
			</p>
			<p className="m-0 text-balance text-moon-dim">{m.festival_over_text()}</p>
			<p className="m-0 text-sm text-moon-dim/80">{m.festival_over_next()}</p>
		</div>
	);
}

/** No edition in the CMS at all — nothing to count down to and nothing to show. */
export function FestivalTba() {
	return (
		<div className="flex w-full max-w-lg flex-col items-center gap-3 text-center">
			<p className="m-0 font-display text-2xl text-glow">
				{m.festival_tba_title()}
			</p>
			<p className="m-0 text-balance text-moon-dim">{m.festival_tba_text()}</p>
		</div>
	);
}
