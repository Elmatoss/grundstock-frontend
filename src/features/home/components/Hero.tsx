import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";
import { Countdown } from "./Countdown";

// Fireflies/stars live in the global NightBackground layer; the hero only
// adds its glow accents and the jungle silhouette (video replaces this later)
export function Hero() {
	return (
		<section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 text-center">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_420px_at_50%_38%,rgba(255,181,36,0.14),transparent_65%),radial-gradient(900px_600px_at_50%_30%,rgba(139,92,246,0.12),transparent_70%)]"
			/>
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
