import { z } from "zod";
import { zEdition } from "#/features/festival/types";
import { zLocaleString, zSanityImage } from "#/lib/sanity";

/**
 * A picture or clip from a past festival.
 *
 * The image is always there, even for a clip, where it is the poster behind the
 * play button — so the gallery has exactly one kind of tile to lay out.
 */
export const zMemory = z.object({
	id: z.string(),
	image: zSanityImage,
	youtubeId: z.string().nullish(),
	caption: zLocaleString.nullish(),
});

export const zMemoryList = z.array(zMemory);

export type Memory = z.infer<typeof zMemory>;

/** An edition plus how much there is to see, for the archive index cards. */
export const zEditionSummary = zEdition.extend({
	artistCount: z.number().catch(0),
	workshopCount: z.number().catch(0),
	memoryCount: z.number().catch(0),
});

export const zEditionSummaryList = z
	.array(zEditionSummary.nullable().catch(null))
	.transform((editions) => editions.filter((edition) => edition !== null));

export type EditionSummary = z.infer<typeof zEditionSummary>;
