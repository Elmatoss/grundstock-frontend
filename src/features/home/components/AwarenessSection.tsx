import { Link } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";
import { Section } from "./Section";

export function AwarenessSection() {
	return (
		<Section kicker={m.awareness_kicker()} title={m.awareness_title()}>
			<p className="m-0 max-w-2xl text-lg text-moon-dim">
				{m.awareness_text()}
			</p>
			<Link
				to="/festival-policy"
				className="mt-6 inline-block rounded-full border border-glow/40 bg-glow/10 px-4 py-2 font-display text-sm font-semibold text-glow-soft no-underline transition-colors hover:border-glow hover:text-glow"
			>
				{m.awareness_more()} →
			</Link>
		</Section>
	);
}
