import imageUrlBuilder from "@sanity/image-url";
import { z } from "zod";
import { getLocale } from "#/paraglide/runtime";

const projectId = "0wrmpf0k";
const dataset = "production";
const apiVersion = "2026-07-06";

const zQueryResponse = z.object({ result: z.unknown() });

// Read-only GROQ GET against the public CDN endpoint. Replaces @sanity/client
// (~173 KB in every page's bundle) — this site only ever runs published,
// tokenless queries, so the full client is dead weight.
export async function sanityFetch(
	query: string,
	params: Record<string, unknown> = {},
): Promise<unknown> {
	const url = new URL(
		`https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`,
	);
	url.searchParams.set("query", query);
	url.searchParams.set("perspective", "published");
	for (const [key, value] of Object.entries(params)) {
		// GROQ params go over the wire JSON-encoded, keyed as $name
		url.searchParams.set(`$${key}`, JSON.stringify(value));
	}
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Sanity query failed: ${response.status}`);
	}
	return zQueryResponse.parse(await response.json()).result ?? null;
}

const builder = imageUrlBuilder({ projectId, dataset });

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

// src/srcSet/width/height for an <img> with a fixed display size: DPR-graded
// candidates (1x/1.5x/2x) so phones don't download desktop crops. Pair with a
// `sizes` attribute at the call site; width/height reserve layout (no CLS).
export function sanityImageProps(
	source: ImageSource,
	width: number,
	height: number,
) {
	const candidate = (dpr: number) => {
		const w = Math.round(width * dpr);
		return `${sanityCropUrl(source, w, Math.round((height / width) * w))} ${w}w`;
	};
	return {
		src: sanityCropUrl(source, width, height),
		srcSet: [1, 1.5, 2].map(candidate).join(", "),
		width,
		height,
	};
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

// Mirrors the CMS localeBlock object (portable text per language)
export const zLocaleBlock = z.looseObject({
	de: z.array(z.unknown()).nullish(),
	en: z.array(z.unknown()).nullish(),
});

export type LocaleBlock = z.infer<typeof zLocaleBlock>;

export function localizedBlock(value: LocaleBlock | null | undefined) {
	if (!value) return undefined;
	if (getLocale() === "en" && value.en?.length) return value.en;
	return value.de ?? undefined;
}

export const zSanityImage = z.looseObject({
	asset: z.unknown(),
	alt: z.string().nullish(),
});

export type SanityImage = z.infer<typeof zSanityImage>;
