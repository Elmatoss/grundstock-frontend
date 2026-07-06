import { z } from "zod";
import { zFestivalDay } from "#/features/lineup/types";
import { zLocaleString, zSanityImage } from "#/lib/sanity";

export const zWorkshop = z.object({
	title: z.string(),
	slug: z.string(),
	host: z.string().nullish(),
	description: zLocaleString.nullish(),
	image: zSanityImage.nullish(),
	day: zFestivalDay.nullish(),
	time: z.string().nullish(),
	location: z.string().nullish(),
});

export const zWorkshopList = z.array(zWorkshop);

export type Workshop = z.infer<typeof zWorkshop>;
