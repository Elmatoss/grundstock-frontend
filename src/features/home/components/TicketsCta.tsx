import { Link } from "@tanstack/react-router";
import { ComingSoon } from "#/components/ComingSoon";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";
import { localizeHref } from "#/paraglide/runtime";

export function TicketsCta() {
	return (
		// `id` is where /tickets lands while there is no shop to send it to
		<section id="tickets" className="page-wrap scroll-mt-24 py-16 sm:py-20">
			{/* The page's primary conversion, so it's the one panel that gets lit.
			    .inner-glow puts the light source inside the card (see styles.css)
			    rather than hanging a halo off its outside edge. */}
			<div className="inner-glow relative overflow-hidden rounded-xs border border-glow/25 bg-night-soft px-6 py-12 text-center sm:px-12">
				<p className="m-0 text-xs font-semibold tracking-[0.25em] text-glow uppercase">
					{m.tickets_kicker()}
				</p>
				<h2 className="mt-2 mb-0 font-display text-3xl text-moon sm:text-4xl">
					{m.tickets_title()}
				</h2>
				<p className="mx-auto mt-4 mb-0 max-w-xl text-moon-dim">
					{m.tickets_text()}
				</p>
				{site.ticketUrl ? (
					<a
						href={localizeHref("/tickets")}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-6 btn btn-primary btn-lg no-underline"
					>
						{m.cta_tickets()}
					</a>
				) : (
					<ComingSoon className="mt-6" />
				)}
				<p className="mt-4 mb-0 text-xs tracking-widest text-moon-dim/85 uppercase">
					{m.tickets_note_age()}
				</p>
				<p className="mx-auto mt-3 mb-0 max-w-md text-xs text-moon-dim/85">
					{m.tickets_note_terms()}{" "}
					<Link
						to="/festival-policy"
						className="text-moon-dim underline hover:text-moon"
					>
						{m.footer_policy()}
					</Link>{" "}
					&{" "}
					<Link
						to="/ticketbedingungen"
						className="text-moon-dim underline hover:text-moon"
					>
						{m.footer_ticketbedingungen()}
					</Link>
					.
				</p>
			</div>
		</section>
	);
}
