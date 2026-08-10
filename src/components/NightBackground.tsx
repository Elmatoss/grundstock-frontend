// Deterministic PRNG (mulberry32): positions must be identical on server and
// client or hydration mismatches flicker the whole layer
function mulberry32(seed: number) {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const rand = mulberry32(20260813);

// Three drift characters, cycled by index: how a firefly accelerates out of a
// waypoint differs between them, so no two neighbours move quite alike even where
// their durations happen to land close together.
const EASES = [
	"ease-in-out",
	"cubic-bezier(0.37, 0, 0.63, 1)",
	"cubic-bezier(0.65, 0, 0.35, 1)",
];

const COUNT = 40;
/** Beyond this index a firefly is desktop-only — a phone gets the first 24. */
const MOBILE_COUNT = 24;

const FIREFLIES = Array.from({ length: COUNT }, (_, i) => {
	// 1.4–5px. The spread matters more than the range: a swarm of identical dots
	// reads as a particle effect, a swarm with near and far members reads as depth.
	const size = rand() * 3.6 + 1.4;
	const floatDuration = rand() * 10 + 8;
	const blinkDuration = rand() * 5 + 3.5;

	// Four waypoints rather than two, each an independent random distance away, so
	// the dot covers different ground in every leg of the loop and therefore appears
	// to speed up, slow down and change its mind. Two waypoints read as an orbit.
	const waypoints: Record<string, string> = {};
	for (let leg = 1; leg <= 4; leg++) {
		waypoints[`--fx${leg}`] = `${((rand() - 0.5) * 84).toFixed(1)}px`;
		waypoints[`--fy${leg}`] = `${((rand() - 0.5) * 84).toFixed(1)}px`;
	}

	return {
		id: i,
		style: {
			// Drives both the dot and its glow radius — see .firefly in styles.css
			"--fly-size": `${size.toFixed(2)}px`,
			width: `${size.toFixed(2)}px`,
			height: `${size.toFixed(2)}px`,
			top: `${(rand() * 100).toFixed(2)}%`,
			left: `${(rand() * 100).toFixed(2)}%`,
			"--float-duration": `${floatDuration.toFixed(1)}s`,
			"--blink-duration": `${blinkDuration.toFixed(1)}s`,
			// Negative, and spread across the full cycle. This is the fix for the
			// swarm hanging still and bright for a few seconds after load: a positive
			// delay holds the element at its un-animated style and then snaps it onto
			// the first keyframe, whereas a negative one starts it already that far in.
			"--float-delay": `${(-rand() * floatDuration).toFixed(1)}s`,
			"--blink-delay": `${(-rand() * blinkDuration).toFixed(1)}s`,
			"--float-ease": EASES[i % EASES.length],
			...waypoints,
		} as React.CSSProperties,
	};
});

export function NightBackground() {
	return (
		<div
			aria-hidden="true"
			className="night-backdrop pointer-events-none fixed inset-x-0 top-0 -z-10 overflow-hidden"
		>
			{FIREFLIES.map((f) => (
				<span
					key={f.id}
					className={`firefly absolute rounded-full ${f.id >= MOBILE_COUNT ? "hidden lg:block" : ""}`}
					style={f.style}
				/>
			))}
		</div>
	);
}
