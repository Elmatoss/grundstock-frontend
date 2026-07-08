import {
	cookieName,
	extractLocaleFromUrl,
	localizeUrl,
} from "#/paraglide/runtime";

// Highest-q language decides; q=0 entries are explicit rejections (RFC 9110)
// and never win. Missing, wildcard or unparseable headers count as German so
// crawlers and odd clients stay on the canonical German URLs.
export function prefersGerman(header: string | null): boolean {
	if (!header) return true;
	const entries = header
		.split(",")
		.map((entry) => {
			const [tag, ...params] = entry.trim().split(";");
			const q = params
				.map((param) => param.trim())
				.find((param) => param.startsWith("q="));
			return {
				tag: (tag ?? "").trim().toLowerCase(),
				q: q ? Number.parseFloat(q.slice(2)) : 1,
			};
		})
		.filter((entry) => entry.tag && !Number.isNaN(entry.q));
	const ranked = entries
		.filter((entry) => entry.q > 0)
		.sort((a, b) => b.q - a.q);
	const top = ranked[0];
	if (top) return top.tag === "*" || top.tag.startsWith("de");
	// Everything listed was rejected with q=0: stay German unless German
	// itself is among the rejections
	return !entries.some((entry) => entry.tag.startsWith("de"));
}

// Language negotiation with English as the fallback for non-German browsers.
// Explicit /en URLs are never redirected; German URLs redirect to /en when a
// stored switcher choice says so, or — on first visit, no cookie — when the
// browser's preferred language is not German.
export function localeRedirect(request: Request, url: URL): Response | null {
	if (request.method !== "GET" && request.method !== "HEAD") return null;
	if (!request.headers.get("accept")?.includes("text/html")) return null;

	// extractLocaleFromUrl is the runtime's own URL-strategy resolver;
	// getLocaleForUrl looks similar but answers "de" for /en and loops.
	// Normalizing trailing slashes keeps the redirect a single hop.
	const normalized = new URL(url);
	if (normalized.pathname !== "/" && normalized.pathname.endsWith("/")) {
		normalized.pathname = normalized.pathname.replace(/\/+$/, "");
	}
	if (extractLocaleFromUrl(normalized) !== "de") return null;

	const stored = (request.headers.get("cookie") ?? "").match(
		new RegExp(`(?:^|;\\s*)${cookieName}=([^;]+)`),
	)?.[1];
	if (stored) {
		if (stored !== "en") return null;
	} else if (prefersGerman(request.headers.get("accept-language"))) {
		return null;
	}

	return new Response(null, {
		status: 302,
		headers: {
			location: localizeUrl(normalized, { locale: "en" }).toString(),
			vary: "Accept-Language, Cookie",
			"cache-control": "no-store",
		},
	});
}
