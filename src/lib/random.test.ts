import { describe, expect, it } from "vitest";
import { mulberry32, pickRandom, randomSeed } from "./random";

const LINEUP = Array.from({ length: 39 }, (_, i) => `act-${i}`);

describe("mulberry32", () => {
	it("returns the same sequence for the same seed", () => {
		const a = mulberry32(42);
		const b = mulberry32(42);
		expect([a(), a(), a()]).toEqual([b(), b(), b()]);
	});

	it("returns a different sequence for a different seed", () => {
		expect(mulberry32(1)()).not.toBe(mulberry32(2)());
	});

	it("stays within [0, 1)", () => {
		const random = mulberry32(7);
		const values = Array.from({ length: 500 }, random);
		expect(Math.min(...values)).toBeGreaterThanOrEqual(0);
		expect(Math.max(...values)).toBeLessThan(1);
	});
});

describe("pickRandom", () => {
	it("is fully determined by the seed", () => {
		// The whole point: the server and the client run this with the same seed and
		// must land on the same ten acts, or hydration swaps the carousel out
		expect(pickRandom(LINEUP, 10, 12345)).toEqual(
			pickRandom(LINEUP, 10, 12345),
		);
	});

	it("returns the requested count", () => {
		expect(pickRandom(LINEUP, 10, 1)).toHaveLength(10);
	});

	it("never repeats an item", () => {
		for (const seed of [1, 2, 3, 999, 2 ** 30]) {
			const picked = pickRandom(LINEUP, 10, seed);
			expect(new Set(picked).size).toBe(picked.length);
		}
	});

	it("picks only real members of the input", () => {
		for (const item of pickRandom(LINEUP, 10, 77)) {
			expect(LINEUP).toContain(item);
		}
	});

	it("gives a different selection for a different seed", () => {
		const a = pickRandom(LINEUP, 10, 1);
		const b = pickRandom(LINEUP, 10, 2);
		expect(a).not.toEqual(b);
	});

	it("shows everything rather than erroring when the lineup is shorter than asked", () => {
		const three = LINEUP.slice(0, 3);
		expect(pickRandom(three, 10, 1)).toHaveLength(3);
		expect([...pickRandom(three, 10, 1)].sort()).toEqual([...three].sort());
	});

	it("survives an empty lineup", () => {
		expect(pickRandom([], 10, 1)).toEqual([]);
	});

	it("leaves the input untouched", () => {
		const original = [...LINEUP];
		pickRandom(LINEUP, 10, 5);
		expect(LINEUP).toEqual(original);
	});

	it("reaches every act across many seeds, so nobody is unreachable", () => {
		const seen = new Set<string>();
		for (let seed = 0; seed < 300; seed++) {
			for (const item of pickRandom(LINEUP, 10, seed)) seen.add(item);
		}
		expect(seen.size).toBe(LINEUP.length);
	});
});

describe("randomSeed", () => {
	it("produces a non-negative integer in range", () => {
		for (let i = 0; i < 50; i++) {
			const seed = randomSeed();
			expect(Number.isInteger(seed)).toBe(true);
			expect(seed).toBeGreaterThanOrEqual(0);
			expect(seed).toBeLessThan(2 ** 31);
		}
	});
});
