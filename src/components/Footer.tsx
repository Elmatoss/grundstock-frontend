import { m } from "#/paraglide/messages";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-border">
			<div className="page-wrap flex flex-col items-center gap-2 py-8 text-center text-sm text-moon-dim">
				<p className="m-0">{m.footer_credit()}</p>
				<p className="m-0">&copy; {year} Neues Brett e.V.</p>
			</div>
		</footer>
	);
}
