import { describe, expect, it } from "vitest";
import { zFaqItem } from "#/features/infos/types";
import { zSiteSettings } from "#/features/settings/types";
import { zWorkshop } from "#/features/workshops/types";
import { zArtistDetail, zArtistList } from "./types";

// Realistic CMS payloads: the zod boundary must accept sparse documents
// (draft-grade content) and reject structurally broken ones.

const minimalArtist = { name: "Nachtfalter", slug: "nachtfalter" };

const fullArtist = {
	name: "Glühwürmchen Kollektiv",
	slug: "gluehwuermchen-kollektiv",
	genres: ["DnB", "Techno"],
	shortBlurb: { de: "Bis in den Morgen.", en: "Until sunrise." },
	image: {
		asset: { _ref: "image-abc-1200x900-jpg", _type: "reference" },
		alt: "Live 2025",
	},
	featured: true,
	performances: [
		{
			day: "sa",
			start: "23:00",
			end: "00:30",
			stage: {
				name: "Schepperschuppen",
				slug: "schepperschuppen",
				order: 3,
				tagline: null,
			},
		},
	],
};

describe("artist schemas", () => {
	it("accepts minimal and fully populated cards", () => {
		expect(zArtistList.parse([minimalArtist, fullArtist])).toHaveLength(2);
	});

	it("accepts detail payloads with bio and links", () => {
		const detail = zArtistDetail.parse({
			...fullArtist,
			bio: { de: [{ _type: "block" }], en: null },
			links: [
				{ _key: "ig", title: "Instagram", url: "https://instagram.com/x" },
				{
					_key: "sc1",
					title: "SoundCloud (Camillo)",
					url: "https://soundcloud.com/a",
				},
				{
					_key: "sc2",
					title: "SoundCloud (DJ GoodBoy)",
					url: "https://soundcloud.com/b",
				},
			],
		});
		expect(detail.links).toHaveLength(3);
		expect(detail.links?.[0]?.title).toBe("Instagram");
	});

	it("rejects unknown performance days", () => {
		expect(() =>
			zArtistList.parse([{ ...minimalArtist, performances: [{ day: "so" }] }]),
		).toThrow();
	});

	it("degrades a malformed set time to 'not announced' instead of throwing", () => {
		// One editor typo must not take the whole lineup page down with it
		const [artist] = zArtistList.parse([
			{ ...minimalArtist, performances: [{ day: "sa", start: "23 Uhr" }] },
		]);
		expect(artist.performances?.[0]?.start).toBeNull();
	});

	it("rejects locale strings without the required German value", () => {
		expect(() =>
			zArtistList.parse([{ ...minimalArtist, shortBlurb: { en: "only en" } }]),
		).toThrow();
	});

	it("rejects malformed link URLs", () => {
		expect(() =>
			zArtistDetail.parse({
				...minimalArtist,
				links: [{ title: "Spotify", url: "not a url" }],
			}),
		).toThrow();
	});
});

describe("workshop schema", () => {
	it("accepts a sparse workshop", () => {
		expect(
			zWorkshop.parse({ title: "Siebdruck", slug: "siebdruck" }).day,
		).toBeUndefined();
	});

	it("accepts a scheduled workshop with locale description", () => {
		const workshop = zWorkshop.parse({
			title: "Siebdruck",
			slug: "siebdruck",
			host: "Mara",
			description: { de: "Bring ein Shirt mit." },
			day: "fr",
			time: "11:00",
			location: "Workshop-Zelt",
		});
		expect(workshop.description?.de).toBe("Bring ein Shirt mit.");
	});
});

describe("faq schema", () => {
	it("accepts a categorized item", () => {
		const item = zFaqItem.parse({
			question: { de: "Ab wann?", en: "From when?" },
			answer: { de: "Ab 18." },
			category: "tickets",
			order: 1,
		});
		expect(item.category).toBe("tickets");
	});

	it("rejects unknown categories but allows missing ones", () => {
		expect(() =>
			zFaqItem.parse({
				question: { de: "?" },
				answer: { de: "!" },
				category: "merch",
			}),
		).toThrow();
		expect(
			zFaqItem.parse({ question: { de: "?" }, answer: { de: "!" } }).category,
		).toBeUndefined();
	});
});

describe("site settings schema", () => {
	it("accepts a published announcement", () => {
		const settings = zSiteSettings.parse({
			announcement: { de: "Earlybird läuft!", en: "Earlybird live!" },
		});
		expect(settings?.announcement?.de).toBe("Earlybird läuft!");
	});

	it("accepts a missing singleton and a cleared announcement", () => {
		expect(zSiteSettings.parse(null)).toBeNull();
		expect(zSiteSettings.parse({})?.announcement).toBeUndefined();
	});
});
