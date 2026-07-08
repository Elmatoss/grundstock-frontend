import { describe, expect, it } from "vitest";
import { splitCountdown } from "./Countdown";

const MS = { second: 1000, minute: 60_000, hour: 3_600_000, day: 86_400_000 };

describe("splitCountdown", () => {
	it("decomposes a duration into days/hours/minutes/seconds", () => {
		const ms = 2 * MS.day + 3 * MS.hour + 4 * MS.minute + 5 * MS.second;
		expect(splitCountdown(ms)).toEqual({
			days: 2,
			hours: 3,
			minutes: 4,
			seconds: 5,
		});
	});

	it("is all zero at the target instant", () => {
		expect(splitCountdown(0)).toEqual({
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
		});
	});

	it("floors sub-second remainders", () => {
		expect(splitCountdown(1999)).toEqual({
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 1,
		});
	});

	it("rolls units over at their boundaries", () => {
		expect(splitCountdown(MS.day)).toEqual({
			days: 1,
			hours: 0,
			minutes: 0,
			seconds: 0,
		});
		expect(splitCountdown(MS.day - MS.second)).toEqual({
			days: 0,
			hours: 23,
			minutes: 59,
			seconds: 59,
		});
	});
});
