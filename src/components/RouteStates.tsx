import { Link } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";

export function PagePending() {
	return (
		<main className="flex flex-1 items-center justify-center px-4 py-24">
			<p className="m-0 animate-pulse font-display text-xl text-moon-dim">
				{m.state_loading()}
			</p>
		</main>
	);
}

export function PageError() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
			<h1 className="m-0 font-display text-2xl font-bold text-moon">
				{m.state_error_title()}
			</h1>
			<p className="m-0 text-moon-dim">{m.state_error_text()}</p>
			<Link
				to="/"
				className="mt-3 rounded-full border border-moon-dim/40 px-5 py-2.5 text-sm font-semibold text-moon no-underline transition-colors hover:border-glow hover:text-glow"
			>
				{m.notfound_cta()}
			</Link>
		</main>
	);
}
