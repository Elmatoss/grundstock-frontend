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

// Back up to a proper swarm so the layer actually reads. Elegance comes from the
// timing, not the count: long, desynchronised drift and slow pulses (see
// firefly-blink in styles.css) instead of the fast strobing of the original.
const FIREFLIES = Array.from({ length: 32 }, (_, i) => ({
	id: i,
	size: rand() * 2.5 + 1.5,
	top: rand() * 100,
	left: rand() * 100,
	floatDuration: rand() * 10 + 12,
	floatDelay: rand() * 10,
	blinkDuration: rand() * 4 + 4.5,
	blinkDelay: rand() * 6,
	fx1: (rand() - 0.5) * 48,
	fy1: (rand() - 0.5) * 48,
	fx2: (rand() - 0.5) * 48,
	fy2: (rand() - 0.5) * 48,
}));

export function NightBackground() {
	return (
		<div
			aria-hidden="true"
			className="night-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden"
		>
			{FIREFLIES.map((f) => (
				<span
					key={f.id}
					className={`firefly absolute rounded-full ${f.id >= 22 ? "hidden lg:block" : ""}`}
					style={
						{
							width: f.size,
							height: f.size,
							top: `${f.top}%`,
							left: `${f.left}%`,
							backgroundColor: "var(--glow-soft)",
							"--float-duration": `${f.floatDuration}s`,
							"--float-delay": `${f.floatDelay}s`,
							"--fx1": `${f.fx1}px`,
							"--fy1": `${f.fy1}px`,
							"--fx2": `${f.fx2}px`,
							"--fy2": `${f.fy2}px`,
							"--blink-duration": `${f.blinkDuration}s`,
							"--blink-delay": `${f.blinkDelay}s`,
						} as React.CSSProperties
					}
				/>
			))}
		</div>
	);
}
