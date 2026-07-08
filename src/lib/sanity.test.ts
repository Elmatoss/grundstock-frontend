import { afterEach, describe, expect, it, vi } from "vitest";
import { baseLocale, overwriteGetLocale } from "#/paraglide/runtime";
import {
	localized,
	localizedBlock,
	sanityFetch,
	sanityImageProps,
} from "./sanity";

function setLocaleTo(locale: "de" | "en") {
	overwriteGetLocale(() => locale);
}

afterEach(() => {
	setLocaleTo(baseLocale);
	vi.unstubAllGlobals();
});

describe("localized", () => {
	it("returns German by default and empty string for missing values", () => {
		setLocaleTo("de");
		expect(localized({ de: "Hallo", en: "Hello" })).toBe("Hallo");
		expect(localized(null)).toBe("");
		expect(localized(undefined)).toBe("");
	});

	it("returns English only when present, falling back to German", () => {
		setLocaleTo("en");
		expect(localized({ de: "Hallo", en: "Hello" })).toBe("Hello");
		expect(localized({ de: "Hallo", en: null })).toBe("Hallo");
		expect(localized({ de: "Hallo" })).toBe("Hallo");
	});
});

describe("localizedBlock", () => {
	const deBlocks = [{ _type: "block", children: [] }];
	const enBlocks = [{ _type: "block", children: [], style: "normal" }];

	it("selects the locale's portable text with German fallback", () => {
		setLocaleTo("en");
		expect(localizedBlock({ de: deBlocks, en: enBlocks })).toBe(enBlocks);
		// empty English array falls back to German content
		expect(localizedBlock({ de: deBlocks, en: [] })).toBe(deBlocks);
		setLocaleTo("de");
		expect(localizedBlock({ de: deBlocks, en: enBlocks })).toBe(deBlocks);
		expect(localizedBlock(null)).toBeUndefined();
		expect(localizedBlock({ de: null })).toBeUndefined();
	});
});

describe("sanityFetch", () => {
	it("queries the CDN endpoint with encoded GROQ params and unwraps result", async () => {
		const fetchMock = vi.fn(
			async (_input: URL) =>
				new Response(JSON.stringify({ result: [{ name: "Act" }] }), {
					headers: { "content-type": "application/json" },
				}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const result = await sanityFetch("*[slug.current == $slug][0]{ name }", {
			slug: "act",
		});

		expect(result).toEqual([{ name: "Act" }]);
		expect(fetchMock).toHaveBeenCalledOnce();
		const requested = new URL(fetchMock.mock.calls[0]?.[0] ?? "");
		expect(requested.hostname).toBe("0wrmpf0k.apicdn.sanity.io");
		expect(requested.pathname).toBe("/v2026-07-06/data/query/production");
		expect(requested.searchParams.get("query")).toBe(
			"*[slug.current == $slug][0]{ name }",
		);
		// GROQ params travel JSON-encoded under $name
		expect(requested.searchParams.get("$slug")).toBe('"act"');
		expect(requested.searchParams.get("perspective")).toBe("published");
	});

	it("normalizes a missing result to null", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response(JSON.stringify({ result: null }))),
		);
		expect(await sanityFetch("*[_type == 'artist'][0]")).toBeNull();
	});

	it("throws on non-OK responses", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("boom", { status: 500 })),
		);
		await expect(sanityFetch("*")).rejects.toThrow("Sanity query failed: 500");
	});
});

describe("sanityImageProps", () => {
	const source = {
		asset: {
			_ref: "image-0123456789abcdef0123456789abcdef01234567-1200x900-jpg",
			_type: "reference",
		},
	};

	it("produces src, DPR-graded srcSet and layout dimensions", () => {
		const props = sanityImageProps(source, 480, 360);
		expect(props.width).toBe(480);
		expect(props.height).toBe(360);
		expect(props.src).toContain("w=480");
		expect(props.src).toContain("h=360");
		expect(props.src).toContain("fit=crop");
		expect(props.src).toContain("auto=format");

		const candidates = props.srcSet.split(", ");
		expect(candidates).toHaveLength(3);
		expect(candidates[0]).toContain("w=480");
		expect(candidates[0]).toMatch(/ 480w$/);
		expect(candidates[1]).toContain("w=720");
		expect(candidates[1]).toContain("h=540");
		expect(candidates[2]).toMatch(/ 960w$/);
	});
});
