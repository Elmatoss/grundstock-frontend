import { z } from "zod";
import { zLocaleString } from "#/lib/sanity";

// The singleton may not exist (or be unpublished) — the query returns null then
export const zSiteSettings = z
	.object({ announcement: zLocaleString.nullish() })
	.nullable();

export type SiteSettings = z.infer<typeof zSiteSettings>;
