import { z } from "zod";
import { zFestivalDay } from "#/features/lineup/types";
import { zLocaleString } from "#/lib/sanity";

// No host, image or location: they were empty on every workshop and the venue is
// always the Workshop-Zelt. No end time either — the programme only publishes when
// a workshop starts.
export const zWorkshop = z.object({
	title: z.string(),
	slug: z.string(),
	description: zLocaleString.nullish(),
	day: zFestivalDay.nullish(),
	start: z
		.string()
		.regex(/^([01]\d|2[0-3]):[0-5]\d$/)
		// One editor typo must not take the page down — the workshop then simply
		// reads as "time to be announced"
		.nullish()
		.catch(null),
});

export const zWorkshopList = z.array(zWorkshop);

export type Workshop = z.infer<typeof zWorkshop>;
