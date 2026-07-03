import { createFileRoute } from "@tanstack/react-router";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
			<p className="m-0 font-serif text-lg tracking-wide text-glow-soft">
				{m.hero_date_location()}
			</p>
			<h1 className="m-0 font-display text-6xl font-bold text-moon [text-shadow:0_0_48px_rgba(255,181,36,0.3)] sm:text-8xl">
				Grundstock
			</h1>
			<p className="m-0 max-w-xl text-balance text-moon-dim">
				{m.hero_tagline()}
			</p>
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
					href={site.helfertoolUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="rounded-full border border-moon-dim/40 px-6 py-3 font-semibold text-moon no-underline transition-colors hover:border-glow hover:text-glow"
				>
					{m.cta_helfen()}
				</a>
			</div>
			<p className="m-0 mt-8 text-sm text-moon-dim/70">
				{m.hero_coming_soon()}
			</p>
		</main>
	);
}
