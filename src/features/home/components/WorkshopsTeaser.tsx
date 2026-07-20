import { Link } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";
import { Section } from "./Section";

export function WorkshopsTeaser() {
	return (
		<Section
			id="workshops"
			kicker={m.workshops_kicker()}
			title={m.workshops_title()}
		>
			<p className="m-0 max-w-2xl text-moon-dim">{m.workshops_text()}</p>
			<Link
				to="/workshops"
				className="mt-6 inline-block rounded-full border border-glow/40 bg-glow/10 px-4 py-2 font-display text-sm font-semibold text-glow-soft no-underline transition-colors hover:border-glow hover:text-glow"
			>
				{m.workshops_cta()} →
			</Link>
		</Section>
	);
}
