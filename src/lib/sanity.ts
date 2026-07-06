import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { z } from "zod";
import { getLocale } from "#/paraglide/runtime";

export const sanityClient = createClient({
	projectId: "0wrmpf0k",
	dataset: "production",
	apiVersion: "2026-07-06",
	useCdn: true,
	perspective: "published",
});

const builder = imageUrlBuilder(sanityClient);

type ImageSource = Parameters<typeof builder.image>[0];

export function sanityImage(source: ImageSource) {
	return builder.image(source).auto("format");
}

export function sanityCropUrl(
	source: ImageSource,
	width: number,
	height: number,
) {
	return (
		sanityImage(source)
			.width(width)
			.height(height)
			// biome-ignore lint/suspicious/noFocusedTests: `fit` is @sanity/image-url's crop mode, not a focused test
			.fit("crop")
			.url()
	);
}

// Mirrors the CMS localeString/localeText objects: de required, en added later
export const zLocaleString = z.looseObject({
	de: z.string(),
	en: z.string().nullish(),
});

export type LocaleString = z.infer<typeof zLocaleString>;

export function localized(value: LocaleString | null | undefined): string {
	if (!value) return "";
	if (getLocale() === "en" && value.en) return value.en;
	return value.de;
}

export const zSanityImage = z.looseObject({
	asset: z.unknown(),
	alt: z.string().nullish(),
});

export type SanityImage = z.infer<typeof zSanityImage>;
