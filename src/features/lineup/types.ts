import { z } from "zod";
import { zLocaleBlock, zLocaleString, zSanityImage } from "#/lib/sanity";

export const zFestivalDay = z.enum(["do", "fr", "sa"]);
export type FestivalDay = z.infer<typeof zFestivalDay>;

export const zPerformance = z.object({
	day: zFestivalDay,
	time: z.string().nullish(),
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
	featured: z.boolean().nullish(),
	performances: z.array(zPerformance).nullish(),
});

export const zArtistList = z.array(zArtistCard);

export const zArtistDetail = zArtistCard.extend({
	bio: zLocaleBlock.nullish(),
	links: z
		.object({
			instagram: z.url().nullish(),
			spotify: z.url().nullish(),
			soundcloud: z.url().nullish(),
			website: z.url().nullish(),
		})
		.nullish(),
});

export type ArtistCard = z.infer<typeof zArtistCard>;
export type ArtistDetail = z.infer<typeof zArtistDetail>;
export type Performance = z.infer<typeof zPerformance>;
