import { site } from "#/lib/site";
import {
	baseLocale,
	getLocale,
	locales,
	localizeHref,
} from "#/paraglide/runtime";

interface SeoInput {
	title: string;
	description?: string;
	/** De-localized pathname of the page, e.g. "/lineup" or `/artists/${slug}` */
	path: string;
	/** Emits robots:noindex and drops canonical/hreflang (mixed signals otherwise) */
	noindex?: boolean;
}

// Per-page head tags that must vary by locale. The root head() only carries
// locale-independent fallbacks: meta is deduped by name/property with the
// deepest match winning, but `links` are concatenated across matches — so
// canonical + hreflang must come from exactly one place, this helper.
export function seo({ title, description, path, noindex }: SeoInput) {
	const url = (locale: (typeof locales)[number]) =>
		`${site.baseUrl}${localizeHref(path, { locale })}`;
	const canonical = url(getLocale());

	return {
		meta: [
			{ title },
			{ property: "og:title", content: title },
			{ property: "og:url", content: canonical },
			...(description
				? [
						{ name: "description", content: description },
						{ property: "og:description", content: description },
					]
				: []),
			...(noindex ? [{ name: "robots", content: "noindex" }] : []),
		],
		links: noindex
			? []
			: [
					{ rel: "canonical", href: canonical },
					...locales.map((locale) => ({
						rel: "alternate",
						hrefLang: locale,
						href: url(locale),
					})),
					{ rel: "alternate", hrefLang: "x-default", href: url(baseLocale) },
				],
	};
}
