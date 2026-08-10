import { mulberry32 } from "#/lib/random";

// A fixed seed, not Math.random(): every position and delay below has to come out
// identical on the server and on the client, or hydration mismatches flicker the
// whole layer. The swarm looks scattered because the PRNG is, not because it is
// re-rolled per visit.
const rand = mulberry32(20260813);

// Three drift characters, cycled by index: how a firefly accelerates out of a
// waypoint differs between them, so no two neighbours move quite alike even where
// their durations happen to land close together.
const EASES = [
	"ease-in-out",
	"cubic-bezier(0.37, 0, 0.63, 1)",
	"cubic-bezier(0.65, 0, 0.35, 1)",
];

const COUNT = 35;
/** Beyond this index a firefly is desktop-only — a phone gets the first 23. */
const MOBILE_COUNT = 23;

const FIREFLIES = Array.from({ length: COUNT }, (_, i) => {
	// 1–4px. The spread matters more than the range: a swarm of identical dots reads
	// as a particle effect, a swarm with near and far members reads as depth.
	const size = rand() * 3 + 1;
	// The floor on each duration is what keeps the swarm calm — the ceiling was never
	// the problem. A short cycle over four waypoints is a lot of ground covered per
	// second, and a handful of fireflies darting made the whole layer read as busy.
	const floatDuration = rand() * 9 + 11;
	const blinkDuration = rand() * 5 + 4;

	// Four waypoints rather than two, each an independent random distance away, so
	// the dot covers different ground in every leg of the loop and therefore appears
	// to speed up, slow down and change its mind. Two waypoints read as an orbit.
	const waypoints: Record<string, string> = {};
	for (let leg = 1; leg <= 4; leg++) {
		waypoints[`--fx${leg}`] = `${((rand() - 0.5) * 68).toFixed(1)}px`;
		waypoints[`--fy${leg}`] = `${((rand() - 0.5) * 68).toFixed(1)}px`;
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
