import { Link } from "@tanstack/react-router";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-border">
			<div className="page-wrap flex flex-col items-center gap-4 py-8 text-center text-sm text-moon-dim">
				<nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
					<Link to="/verein" className="text-moon-dim hover:text-moon">
						{m.nav_verein()}
					</Link>
					<Link to="/infos" className="text-moon-dim hover:text-moon">
						{m.nav_infos()}
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
