import { Link } from "@tanstack/react-router";
import { LogoMark } from "#/components/LogoMark";
import { m } from "#/paraglide/messages";

export default function NotFound() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
			<LogoMark className="h-24 text-glow-soft sm:h-32" />
			<p className="m-0 font-display text-7xl font-bold text-glow [text-shadow:0_0_48px_rgba(255,181,36,0.35)]">
				404
			</p>
			<h1 className="m-0 font-display text-2xl font-bold text-moon">
				{m.notfound_title()}
			</h1>
			<p className="m-0 text-moon-dim">{m.notfound_text()}</p>
			<Link
				to="/"
				className="mt-4 rounded-full bg-glow px-6 py-3 font-semibold text-night no-underline transition-colors hover:bg-glow-soft hover:text-night"
			>
				{m.notfound_cta()}
			</Link>
		</main>
	);
}
