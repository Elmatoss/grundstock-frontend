import { getLocale } from "#/paraglide/runtime";

/**
 * The festival's dates are the festival's dates, whatever timezone the phone
 * reading the page is in. Every date and time on the site is formatted in this
 * zone, never in the viewer's.
 */
export const FESTIVAL_TIME_ZONE = "Europe/Berlin";

/** Paraglide locale → BCP 47 tag for Intl. */
export function intlLocale() {
	return getLocale() === "en" ? "en-GB" : "de-DE";
}

/**
 * Midday on a calendar date.
 *
 * Every date-only value on the site is turned into an instant this way: at noon
 * no offset in play can push the result onto the neighbouring day, so a formatted
 * date never slides for a viewer far east or west.
 */
export function middayOn(date: string) {
	return new Date(`${date}T12:00:00+02:00`);
}
