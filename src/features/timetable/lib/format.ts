import type { FestivalDay } from "#/features/lineup/types";
import { m } from "#/paraglide/messages";
import { getLocale } from "#/paraglide/runtime";

const DAY_LABELS: Record<FestivalDay, () => string> = {
	do: m.day_do,
	fr: m.day_fr,
	sa: m.day_sa,
};

export function dayLabel(day: FestivalDay) {
	return DAY_LABELS[day]();
}

/**
 * "13. August" / "13 August" for a festival day's date.
 *
 * Formatted from a fixed calendar date, never from "now", and pinned to
 * Europe/Berlin — the festival's dates are the festival's dates regardless of
 * which timezone the phone reading the page is in. Midday keeps the date from
 * sliding across a boundary for viewers far east or west.
 */
/**
 * A duration in minutes as "45 min", "2 Std." or "1 Std. 50 min".
 *
 * Anything over an hour has to be spelled as hours — "in 180 min" is technically
 * correct and completely useless to somebody standing in a field working out
 * whether they have time to get food.
 */
export function spanLabel(minutes: number) {
	if (minutes < 60) return m.timetable_span_minutes({ minutes });
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	return rest === 0
		? m.timetable_span_hours({ hours })
		: m.timetable_span_hours_minutes({ hours, minutes: rest });
}

export function dayDateLabel(date: string) {
	return new Intl.DateTimeFormat(getLocale() === "en" ? "en-GB" : "de-DE", {
		day: "numeric",
		month: "long",
		timeZone: "Europe/Berlin",
	}).format(new Date(`${date}T12:00:00+02:00`));
}
