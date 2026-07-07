import { z } from "zod";
import { zLocaleString } from "#/lib/sanity";

export const zFaqCategory = z.enum([
	"allgemein",
	"schichten",
	"essen",
	"anreise",
	"tickets",
]);

export const zFaqItem = z.object({
	question: zLocaleString,
	answer: zLocaleString,
	category: zFaqCategory.nullish(),
	order: z.number().nullish(),
});

export const zFaqList = z.array(zFaqItem);

export type FaqCategory = z.infer<typeof zFaqCategory>;
export type FaqItem = z.infer<typeof zFaqItem>;
