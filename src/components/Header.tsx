import { Link } from "@tanstack/react-router";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export default function Header() {
	const anchors = [
		["lineup", m.nav_lineup()],
		["workshops", m.nav_workshops()],
		["helfen", m.nav_helfen()],
		["anreise", m.nav_anreise()],
	] as const;

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-night/70 backdrop-blur-md">
			<nav className="page-wrap flex items-center justify-between gap-4 py-3">
				<Link
					to="/"
					className="font-display text-lg font-bold tracking-wide text-moon no-underline hover:text-moon"
				>
					Grundstock <span className="text-glow">2026</span>
				</Link>
				<div className="hidden items-center gap-6 md:flex">
					{anchors.map(([hash, label]) => (
						<Link
							key={hash}
							to="/"
							hash={hash}
							className="text-sm font-semibold text-moon-dim no-underline transition-colors hover:text-moon"
						>
							{label}
						</Link>
					))}
				</div>
				<a
					href={site.ticketUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="rounded-full bg-glow px-4 py-2 text-sm font-semibold text-night no-underline transition-colors hover:bg-glow-soft hover:text-night"
				>
					{m.cta_tickets()}
				</a>
			</nav>
		</header>
	);
}
