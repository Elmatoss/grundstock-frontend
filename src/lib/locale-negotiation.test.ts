import { describe, expect, it } from "vitest";
import { localeRedirect, prefersGerman } from "./locale-negotiation";

describe("prefersGerman", () => {
	it("defaults to German when the header is missing", () => {
		expect(prefersGerman(null)).toBe(true);
		expect(prefersGerman("")).toBe(true);
	});

	it("defaults to German for wildcard and unparseable headers", () => {
		expect(prefersGerman("*")).toBe(true);
		expect(prefersGerman(";;q=;")).toBe(true);
	});

	it("accepts any German variant as the top choice", () => {
		expect(prefersGerman("de")).toBe(true);
		expect(prefersGerman("de-DE,de;q=0.9,en;q=0.8")).toBe(true);
		expect(prefersGerman("de-CH")).toBe(true);
	});

	it("prefers the highest q value, not header order", () => {
		expect(prefersGerman("en;q=0.8,de;q=0.9")).toBe(true);
		expect(prefersGerman("de;q=0.8,en;q=0.9")).toBe(false);
	});

	it("treats unquantified entries as q=1", () => {
		expect(prefersGerman("en,de;q=0.9")).toBe(false);
		expect(prefersGerman("de,en;q=0.9")).toBe(true);
	});

	it("is false for non-German top choices", () => {
		expect(prefersGerman("en-US,en;q=0.9")).toBe(false);
		expect(prefersGerman("fr")).toBe(false);
	});

	it("ignores q=0 rejections when ranking", () => {
		// en rejected, de acceptable
		expect(prefersGerman("en;q=0,de;q=0.5")).toBe(true);
		// de explicitly rejected — must not fall back to German
		expect(prefersGerman("de;q=0")).toBe(false);
		// everything listed rejected, German not among them → stay German
		expect(prefersGerman("en;q=0")).toBe(true);
	});
});

const BASE = "https://grundstock-festival.de";

function htmlRequest(
	url: string,
	init: {
		acceptLanguage?: string;
		cookie?: string;
		method?: string;
		accept?: string;
	} = {},
) {
	const headers = new Headers({ accept: init.accept ?? "text/html" });
	if (init.acceptLanguage) headers.set("accept-language", init.acceptLanguage);
	if (init.cookie) headers.set("cookie", init.cookie);
	return new Request(url, { method: init.method ?? "GET", headers });
}

function redirectFor(request: Request) {
	return localeRedirect(request, new URL(request.url));
}

describe("localeRedirect", () => {
	it("redirects English-preferring first visits to /en", () => {
		const response = redirectFor(
			htmlRequest(`${BASE}/lineup`, { acceptLanguage: "en-US,en;q=0.9" }),
		);
		expect(response?.status).toBe(302);
		expect(response?.headers.get("location")).toBe(`${BASE}/en/lineup`);
	});

	it("localizes the root to /en without a trailing slash", () => {
		const response = redirectFor(
			htmlRequest(`${BASE}/`, { acceptLanguage: "en" }),
		);
		expect(response?.headers.get("location")).toBe(`${BASE}/en`);
	});

	it("keeps German-preferring visitors on German URLs", () => {
		expect(
			redirectFor(htmlRequest(`${BASE}/lineup`, { acceptLanguage: "de-DE" })),
		).toBeNull();
	});

	it("never redirects explicit /en URLs", () => {
		expect(
			redirectFor(htmlRequest(`${BASE}/en/lineup`, { acceptLanguage: "de" })),
		).toBeNull();
		expect(
			redirectFor(
				htmlRequest(`${BASE}/en`, {
					acceptLanguage: "de",
					cookie: "PARAGLIDE_LOCALE=de",
				}),
			),
		).toBeNull();
	});

	it("lets a stored switcher choice win over Accept-Language", () => {
		const toEnglish = redirectFor(
			htmlRequest(`${BASE}/lineup`, {
				acceptLanguage: "de-DE",
				cookie: "PARAGLIDE_LOCALE=en",
			}),
		);
		expect(toEnglish?.headers.get("location")).toBe(`${BASE}/en/lineup`);

		const stayGerman = redirectFor(
			htmlRequest(`${BASE}/lineup`, {
				acceptLanguage: "en",
				cookie: "PARAGLIDE_LOCALE=de",
			}),
		);
		expect(stayGerman).toBeNull();
	});

	it("normalizes trailing slashes into a single hop", () => {
		const response = redirectFor(
			htmlRequest(`${BASE}/lineup/`, { acceptLanguage: "en" }),
		);
		expect(response?.headers.get("location")).toBe(`${BASE}/en/lineup`);
	});

	it("preserves query strings", () => {
		const response = redirectFor(
			htmlRequest(`${BASE}/lineup?foo=bar`, { acceptLanguage: "en" }),
		);
		expect(response?.headers.get("location")).toBe(`${BASE}/en/lineup?foo=bar`);
	});

	it("only negotiates GET/HEAD HTML navigations", () => {
		expect(
			redirectFor(
				htmlRequest(`${BASE}/lineup`, { acceptLanguage: "en", method: "POST" }),
			),
		).toBeNull();
		expect(
			redirectFor(
				htmlRequest(`${BASE}/lineup`, {
					acceptLanguage: "en",
					accept: "application/json",
				}),
			),
		).toBeNull();
	});

	it("marks the redirect uncacheable and varying", () => {
		const response = redirectFor(
			htmlRequest(`${BASE}/`, { acceptLanguage: "en" }),
		);
		expect(response?.headers.get("cache-control")).toBe("no-store");
		expect(response?.headers.get("vary")).toBe("Accept-Language, Cookie");
	});
});
