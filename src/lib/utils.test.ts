import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
	it("merges conditional classes", () => {
		expect(cn("p-2", false && "hidden", "text-sm")).toBe("p-2 text-sm");
	});

	it("resolves conflicting tailwind classes to the last one", () => {
		expect(cn("p-2", "p-4")).toBe("p-4");
	});
});
