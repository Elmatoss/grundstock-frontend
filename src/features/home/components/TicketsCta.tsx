import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export function TicketsCta() {
	return (
		<section className="page-wrap py-16 sm:py-20">
			<div className="relative overflow-hidden rounded-2xl border border-glow/30 bg-[radial-gradient(600px_300px_at_50%_-20%,rgba(255,181,36,0.18),transparent_70%)] bg-night-soft px-6 py-12 text-center sm:px-12">
				<p className="m-0 font-display text-sm font-semibold tracking-[0.2em] text-glow uppercase">
					{m.tickets_kicker()}
				</p>
				<h2 className="mt-2 mb-0 font-display text-3xl font-bold text-moon sm:text-4xl">
					{m.tickets_title()}
				</h2>
				<p className="mx-auto mt-4 mb-0 max-w-xl text-moon-dim">
					{m.tickets_text()}
				</p>
				<a
					href={site.ticketUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-6 inline-block rounded-full bg-glow px-8 py-3.5 font-semibold text-night no-underline shadow-[0_0_40px_rgba(255,181,36,0.4)] transition-colors hover:bg-glow-soft hover:text-night"
				>
					{m.cta_tickets()}
				</a>
				<p className="mt-4 mb-0 text-xs tracking-widest text-moon-dim/70 uppercase">
					{m.tickets_note_age()}
				</p>
			</div>
		</section>
	);
}
