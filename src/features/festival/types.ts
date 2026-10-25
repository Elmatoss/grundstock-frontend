import { z } from "zod";
import { zLocaleString, zSanityImage } from "#/lib/sanity";

/**
 * One festival — one year. Everything the site shows belongs to one of these.
 *
 * `from` and `to` are ISO datetimes: `from` is when the gates open (and the date
 * of programme day 1), `to` is the end of the departure day. Together they decide
 * what the site is: counting down, live, or thanking everyone.
 */
export const zEdition = z.object({
	year: z.number().int(),
	from: z.string(),
	to: z.string(),
	// A missing or nonsensical value must not collapse the programme to zero days
	programmeDays: z.number().int().min(1).max(7).catch(3),
	recap: zLocaleString.nullish(),
	aftermovieYoutubeId: z.string().nullish(),
	aftermoviePoster: zSanityImage.nullish(),
});

// Unparseable dates are the one thing that would poison the phase logic
// downstream, so they are rejected here rather than guarded at every use site.
const zUsableEdition = zEdition.refine(
	(edition) =>
		!Number.isNaN(Date.parse(edition.from)) &&
		!Number.isNaN(Date.parse(edition.to)),
	"from and to must be parseable datetimes",
);

/**
 * Every page depends on this list, so one malformed year must not take the whole
 * site down with it: a document that fails to parse is dropped and the rest of
 * the editions render.
 */
export const zEditionList = z
	.array(zUsableEdition.nullable().catch(null))
	.transform((editions) => editions.filter((edition) => edition !== null));

export type Edition = z.infer<typeof zEdition>;
