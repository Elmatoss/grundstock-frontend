import { Link } from "@tanstack/react-router";
import { InstagramIcon } from "lucide-react";
import { LogoMark } from "#/components/LogoMark";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-border">
			<div className="page-wrap flex flex-col items-center gap-4 py-8 text-center text-sm text-moon-dim">
				<LogoMark className="h-8" />
				{/* The festival's main social channel — PLAN.md §4.12 puts it in the
				    footer, but until now it only existed in the ticket small print */}
				<a
					href={site.instagramUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 text-moon-dim no-underline transition-colors hover:text-glow"
				>
					<InstagramIcon className="size-4" aria-hidden="true" />
					<span>@{site.instagramHandle}</span>
				</a>
				<nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
					<Link to="/verein" className="text-moon-dim hover:text-moon">
						{m.nav_verein()}
					</Link>
					<Link to="/infos" className="text-moon-dim hover:text-moon">
						{m.nav_infos()}
					</Link>
					<Link to="/archiv" className="text-moon-dim hover:text-moon">
						{m.nav_archive()}
					</Link>
					<Link to="/festival-policy" className="text-moon-dim hover:text-moon">
						{m.footer_policy()}
					</Link>
					<Link
						to="/ticketbedingungen"
						className="text-moon-dim hover:text-moon"
					>
						{m.footer_ticketbedingungen()}
					</Link>
					<Link to="/impressum" className="text-moon-dim hover:text-moon">
						{m.footer_impressum()}
					</Link>
					<Link to="/datenschutz" className="text-moon-dim hover:text-moon">
						{m.footer_datenschutz()}
					</Link>
					<a
						href={`mailto:${site.contactEmail}`}
						className="text-moon-dim hover:text-moon"
					>
						{m.footer_kontakt()}
					</a>
				</nav>
				<p className="m-0">{m.footer_credit()}</p>
				<p className="m-0">&copy; {year} Neues Brett e.V.</p>
			</div>
		</footer>
	);
}
