import { Link } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";
import { Section } from "./Section";

export function AwarenessSection() {
	return (
		<Section kicker={m.awareness_kicker()} title={m.awareness_title()}>
			<p className="m-0 max-w-2xl text-lg text-moon-dim">
				{m.awareness_text()}
			</p>
			<Link to="/festival-policy" className="mt-6 btn btn-quiet no-underline">
				{m.awareness_more()} →
			</Link>
		</Section>
	);
}
