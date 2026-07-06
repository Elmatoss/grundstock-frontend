import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";
import { Countdown } from "./Countdown";

// Deterministic positions — random values would cause hydration mismatches.
// Fireflies are the amber ones, stars the small pale ones.
const FIREFLIES = [
	{ left: "12%", top: "22%", size: 5, delay: "0s" },
	{ left: "26%", top: "58%", size: 4, delay: "1.2s" },
	{ left: "44%", top: "16%", size: 3, delay: "2.1s" },
	{ left: "68%", top: "30%", size: 5, delay: "0.6s" },
	{ left: "82%", top: "60%", size: 4, delay: "1.8s" },
	{ left: "90%", top: "20%", size: 3, delay: "2.7s" },
	{ left: "8%", top: "72%", size: 3, delay: "0.9s" },
	{ left: "58%", top: "70%", size: 4, delay: "2.4s" },
];

const STARS = [
	{ left: "18%", top: "10%", delay: "0.4s" },
	{ left: "34%", top: "34%", delay: "1.6s" },
	{ left: "52%", top: "8%", delay: "2.8s" },
	{ left: "63%", top: "48%", delay: "0.2s" },
	{ left: "76%", top: "12%", delay: "1.1s" },
	{ left: "88%", top: "42%", delay: "2.2s" },
	{ left: "6%", top: "44%", delay: "1.9s" },
	{ left: "40%", top: "62%", delay: "0.7s" },
	{ left: "95%", top: "68%", delay: "1.4s" },
	{ left: "22%", top: "80%", delay: "2.5s" },
];

export function Hero() {
	return (
		<section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 text-center">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_420px_at_50%_38%,rgba(255,181,36,0.14),transparent_65%),radial-gradient(900px_600px_at_50%_30%,rgba(139,92,246,0.12),transparent_70%)]"
			/>
			<div aria-hidden className="pointer-events-none absolute inset-0">
				{FIREFLIES.map((f) => (
					<span
						key={`${f.left}-${f.top}`}
						style={{
							left: f.left,
							top: f.top,
							width: f.size,
							height: f.size,
							animationDelay: f.delay,
						}}
						className="absolute rounded-full bg-glow shadow-[0_0_12px_4px_rgba(255,181,36,0.45)] motion-safe:animate-twinkle"
					/>
				))}
				{STARS.map((s) => (
					<span
						key={`${s.left}-${s.top}`}
						style={{ left: s.left, top: s.top, animationDelay: s.delay }}
						className="absolute h-0.5 w-0.5 rounded-full bg-moon/80 motion-safe:animate-twinkle"
					/>
				))}
			</div>

			<div className="relative flex flex-col items-center gap-5 pt-16 pb-28">
				<p className="m-0 font-serif text-lg tracking-wide text-glow-soft sm:text-xl">
					{m.hero_date_location()}
				</p>
				<h1 className="m-0 font-display text-6xl leading-none font-bold text-moon [text-shadow:0_0_48px_rgba(255,181,36,0.35)] sm:text-8xl">
					Grund
					<wbr />
					stock
				</h1>
				<p className="m-0 max-w-xl text-balance text-moon-dim">
					{m.hero_tagline()}
				</p>
				<div className="mt-2">
					<Countdown />
				</div>
				<div className="mt-4 flex flex-wrap items-center justify-center gap-3">
					<a
						href={site.ticketUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-full bg-glow px-6 py-3 font-semibold text-night no-underline shadow-[0_0_32px_rgba(255,181,36,0.35)] transition-colors hover:bg-glow-soft hover:text-night"
					>
						{m.cta_tickets()}
					</a>
					<a
						href="#helfen"
						className="rounded-full border border-moon-dim/40 px-6 py-3 font-semibold text-moon no-underline transition-colors hover:border-glow hover:text-glow"
					>
						{m.cta_helfen()}
					</a>
				</div>
			</div>

			<svg
				aria-hidden="true"
				viewBox="0 0 1440 200"
				preserveAspectRatio="none"
				className="pointer-events-none absolute bottom-0 left-0 h-32 w-full sm:h-40"
			>
				<path
					d="M0,200 L0,120 Q60,78 140,108 T300,98 Q380,58 460,102 T640,92 Q720,52 800,98 T980,88 Q1060,48 1140,92 T1300,82 Q1370,58 1440,106 L1440,200 Z"
					fill="#170b30"
					opacity="0.85"
				/>
				<path
					d="M0,200 L0,150 Q90,112 190,140 T400,132 Q500,96 600,134 T820,126 Q930,92 1030,130 T1250,120 Q1350,98 1440,138 L1440,200 Z"
					fill="#0c0518"
				/>
			</svg>

			<a
				href="#intro"
				className="absolute bottom-6 text-2xl text-moon-dim/70 no-underline motion-safe:animate-bounce-soft"
			>
				<span aria-hidden="true">↓</span>
				<span className="sr-only">{m.intro_kicker()}</span>
			</a>
		</section>
	);
}
