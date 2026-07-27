import { Link } from "@tanstack/react-router";
import { LogoMark } from "#/components/LogoMark";
import { m } from "#/paraglide/messages";

export function PagePending() {
	return (
		<main className="flex flex-1 items-center justify-center px-4 py-24">
			<LogoMark className="h-14 animate-pulse text-glow-soft" />
			<span className="sr-only">{m.state_loading()}</span>
		</main>
	);
}

export function PageError() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
			<h1 className="m-0 font-display text-2xl text-moon">
				{m.state_error_title()}
			</h1>
			<p className="m-0 text-moon-dim">{m.state_error_text()}</p>
			<Link to="/" className="mt-3 btn btn-secondary no-underline">
				{m.notfound_cta()}
			</Link>
		</main>
	);
}
