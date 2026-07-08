import { afterEach, describe, expect, it } from "vitest";
import { baseLocale, overwriteGetLocale } from "#/paraglide/runtime";
import { seo } from "./seo";

const BASE = "https://grundstock-festival.de";

function setLocaleTo(locale: "de" | "en") {
	overwriteGetLocale(() => locale);
}

afterEach(() => setLocaleTo(baseLocale));

describe("seo", () => {
	it("emits canonical + og:url for the current (German) locale", () => {
		setLocaleTo("de");
		const head = seo({ title: "Lineup", path: "/lineup" });
		expect(head.links).toContainEqual({
			rel: "canonical",
			href: `${BASE}/lineup`,
		});
		expect(head.meta).toContainEqual({
			property: "og:url",
			content: `${BASE}/lineup`,
		});
	});

	it("emits the /en canonical for the English locale", () => {
		setLocaleTo("en");
		const head = seo({ title: "Lineup", path: "/lineup" });
		expect(head.links).toContainEqual({
			rel: "canonical",
			href: `${BASE}/en/lineup`,
		});
	});

	it("localizes the root path without a trailing /en/ slash", () => {
		setLocaleTo("en");
		const head = seo({ title: "Home", path: "/" });
		expect(head.links).toContainEqual({
			rel: "canonical",
			href: `${BASE}/en`,
		});
	});

	it("emits a full hreflang cluster with x-default on German", () => {
		setLocaleTo("de");
		const { links } = seo({ title: "Lineup", path: "/lineup" });
		expect(links).toContainEqual({
			rel: "alternate",
			hrefLang: "de",
			href: `${BASE}/lineup`,
		});
		expect(links).toContainEqual({
			rel: "alternate",
			hrefLang: "en",
			href: `${BASE}/en/lineup`,
		});
		expect(links).toContainEqual({
			rel: "alternate",
			hrefLang: "x-default",
			href: `${BASE}/lineup`,
		});
	});

	it("includes title and optional description in meta", () => {
		setLocaleTo("de");
		const { meta } = seo({
			title: "Lineup",
			description: "Alle Acts",
			path: "/lineup",
		});
		expect(meta).toContainEqual({ title: "Lineup" });
		expect(meta).toContainEqual({ name: "description", content: "Alle Acts" });
		expect(meta).toContainEqual({
			property: "og:description",
			content: "Alle Acts",
		});
	});

	it("omits description entries when none is given", () => {
		setLocaleTo("de");
		const { meta } = seo({ title: "Impressum", path: "/impressum" });
		expect(
			meta.some((tag) => "name" in tag && tag.name === "description"),
		).toBe(false);
	});

	it("noindex drops canonical and hreflang and adds the robots tag", () => {
		setLocaleTo("de");
		const head = seo({ title: "Impressum", path: "/impressum", noindex: true });
		expect(head.links).toEqual([]);
		expect(head.meta).toContainEqual({ name: "robots", content: "noindex" });
	});
});
