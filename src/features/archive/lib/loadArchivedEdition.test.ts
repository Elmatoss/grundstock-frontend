import { describe, expect, it } from "vitest";
import { pickArchiveYear } from "./loadArchivedEdition";

// The scenario this exists for: 2027 has been published and taken over the main
// pages, so /artists/rawbin no longer resolves there — but the link is still
// being clicked, and Rawbin played in 2026.
const archive = [{ year: 2026 }, { year: 2025 }];

describe("pickArchiveYear", () => {
	it("sends a link shared during the last festival to that year's archive", () => {
		expect(pickArchiveYear([2026], archive)).toBe(2026);
	});

	it("prefers the most recent year an act appeared in", () => {
		// years arrive newest-first from GROQ; a rebooked act goes to its latest
		// archived appearance, not its first
		expect(pickArchiveYear([2026, 2025], archive)).toBe(2026);
	});

	it("falls back to an older year when the newest one is not archived", () => {
		// 2027 is upcoming, so it is not in `archive` — an act booked for it must not
		// be reachable through a guessed URL before the lineup is announced
		expect(pickArchiveYear([2027, 2025], archive)).toBe(2025);
	});

	it("gives up when the act belongs only to unannounced editions", () => {
		expect(pickArchiveYear([2027], archive)).toBeNull();
	});

	it("gives up on an unknown slug", () => {
		expect(pickArchiveYear([], archive)).toBeNull();
	});

	it("gives up when there is no archive yet", () => {
		expect(pickArchiveYear([2026], [])).toBeNull();
	});
});
