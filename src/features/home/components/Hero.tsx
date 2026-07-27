import { m } from "#/paraglide/messages";
import { localizeHref } from "#/paraglide/runtime";
import { Countdown } from "./Countdown";

// Type-only hero: the typographic GRUNDSTOCK *is* the brand here, so the
// eye-mark stays in the header/footer rather than competing with it. Atmosphere
// comes from the global gradient + grain (styles.css) and the sparse fireflies
// in NightBackground — no radial glow blobs, no wavy divider, no drop glow.
export function Hero() {
	return (
		<section className="relative flex min-h-svh flex-col items-center justify-center px-4 text-center">
			<div className="flex flex-col items-center gap-6 pt-16 pb-28">
				<p className="m-0 text-xs font-semibold tracking-[0.3em] text-glow uppercase sm:text-sm">
					{m.hero_date_location()}
				</p>
				<h1 className="wordmark m-0 text-[clamp(2.5rem,12vw,8.5rem)] text-moon">
					Grundstock
				</h1>
				<p className="m-0 max-w-md text-balance text-moon-dim">
					{m.hero_tagline()}
				</p>
				<div className="mt-2">
					<Countdown />
				</div>
				<div className="mt-4 flex flex-wrap items-center justify-center gap-3">
					{/* Plain anchor via the /tickets proxy: the Worker request count is
					    the ticket-conversion metric (docs/PLAN.md §8) */}
					<a
						href={localizeHref("/tickets")}
						target="_blank"
						rel="noopener noreferrer"
						className="btn-primary rounded-xs px-7 py-3 text-sm font-semibold tracking-[0.12em] uppercase no-underline"
					>
						{m.cta_tickets()}
					</a>
					<a
						href="#helfen"
						className="rounded-xs border border-moon-dim/40 px-7 py-3 text-sm font-semibold tracking-[0.12em] text-moon uppercase no-underline transition-colors hover:border-glow hover:text-glow"
					>
						{m.cta_helfen()}
					</a>
				</div>
			</div>

			{/* Replaces the bouncing ↓ — a static hairline reads as a deliberate
			    typographic rule rather than landing-page furniture */}
			<a
				href="#intro"
				className="absolute bottom-10 h-14 w-px bg-linear-to-b from-moon-dim/50 to-transparent no-underline transition-colors hover:from-glow"
			>
				<span className="sr-only">{m.intro_kicker()}</span>
			</a>
		</section>
	);
}
