/**
 * Seeded randomness, for the places where the server and the client have to make
 * the same "random" choice.
 *
 * `Math.random()` cannot be used during render: the server would pick one thing,
 * hydration would pick another, and React would either warn or flicker. Both
 * callers here instead take a seed that travelled from the server — the fireflies
 * hardcode one, the homepage teaser gets a fresh one from its route loader — and
 * derive everything from it deterministically.
 */

/** mulberry32 — small, fast, and good enough for scattering dots and shuffling a list. */
export function mulberry32(seed: number) {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * `count` items drawn from `items` without repeats, chosen by `seed`.
 *
 * A partial Fisher–Yates over a copy: unbiased, never returns the same item twice,
 * and stops after `count` swaps rather than shuffling a list it will then discard
 * most of. Returns everything (shuffled) when `count` exceeds the input, so a
 * shorter list than expected degrades to "show them all" instead of to an error.
 */
export function pickRandom<T>(
	items: readonly T[],
	count: number,
	seed: number,
): T[] {
	const pool = [...items];
	const take = Math.min(count, pool.length);
	const random = mulberry32(seed);
	for (let i = 0; i < take; i++) {
		const j = i + Math.floor(random() * (pool.length - i));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return pool.slice(0, take);
}

/** A fresh seed for one page load. Only ever called outside render — see above. */
export function randomSeed() {
	return Math.floor(Math.random() * 2 ** 31);
}
