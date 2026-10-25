import { FESTIVAL_TIME_ZONE, intlLocale, middayOn } from "#/lib/intl";
import { m } from "#/paraglide/messages";

/**
 * "Donnerstag" / "Thursday" for a programme date.
 *
 * Derived from the date rather than stored, which is what lets an edition run
 * Friday–Sunday without a code change — and means the weekday is never wrong
 * relative to the date printed next to it.
 */
export function dayLabel(date: string) {
	return new Intl.DateTimeFormat(intlLocale(), {
		weekday: "long",
		timeZone: FESTIVAL_TIME_ZONE,
	}).format(middayOn(date));
}

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

/**
 * "13. August" / "13 August" for a programme date.
 *
 * Formatted from a fixed calendar date, never from "now", and pinned to festival
 * time — the festival's dates are the festival's dates regardless of which
 * timezone the phone reading the page is in.
 */
export function dayDateLabel(date: string) {
	return new Intl.DateTimeFormat(intlLocale(), {
		day: "numeric",
		month: "long",
		timeZone: FESTIVAL_TIME_ZONE,
	}).format(middayOn(date));
}
