import { z } from "zod";
import { zLocaleBlock, zLocaleString, zSanityImage } from "#/lib/sanity";

/**
 * Which programme day, counted from the edition's start date: 1 is the opening
 * day. Not a weekday — the weekday is derived from the edition, so an edition
 * that runs Friday–Sunday needs no change here. See
 * #/features/festival/lib/festival.
 */
export const zDayIndex = z.number().int().min(1).max(7);

// Wall-clock "HH:MM" on the programme day, not an absolute datetime — see
// #/features/timetable/lib/schedule for how the two resolve to an instant.
const zClockTime = z
	.string()
	.regex(/^([01]\d|2[0-3]):[0-5]\d$/)
	// A malformed time must not take the whole lineup page down with it: the act
	// then simply reads as "time to be announced".
	.nullish()
	.catch(null);

export const zPerformance = z.object({
	dayIndex: zDayIndex,
	start: zClockTime,
	end: zClockTime,
	stage: z
		.object({
			name: z.string(),
			slug: z.string(),
			order: z.number().nullish(),
			tagline: zLocaleString.nullish(),
		})
		.nullish(),
});

export const zArtistCard = z.object({
	name: z.string(),
	slug: z.string(),
	genres: z.array(z.string()).nullish(),
	shortBlurb: zLocaleString.nullish(),
	image: zSanityImage.nullish(),
	performances: z.array(zPerformance).nullish(),
});

export const zArtistList = z.array(zArtistCard);

export const zArtistLink = z.object({
	_key: z.string().nullish(),
	title: z.string(),
	url: z.url(),
});

export const zArtistDetail = zArtistCard.extend({
	bio: zLocaleBlock.nullish(),
	links: z.array(zArtistLink).nullish(),
});

export type ArtistCard = z.infer<typeof zArtistCard>;
export type ArtistDetail = z.infer<typeof zArtistDetail>;
export type Performance = z.infer<typeof zPerformance>;
