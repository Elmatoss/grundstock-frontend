import { Link } from "@tanstack/react-router";
import { FeaturedArtists } from "#/features/lineup/components/FeaturedArtists";
import { m } from "#/paraglide/messages";
import { Section } from "./Section";

export function LineupTeaser() {
	return (
		<Section id="lineup" kicker={m.lineup_kicker()} title={m.lineup_title()}>
			<div className="max-w-2xl space-y-4 text-moon-dim">
				<p className="m-0">{m.lineup_text()}</p>
				<p className="m-0">{m.lineup_stages()}</p>
			</div>
			<FeaturedArtists />
			<Link
				to="/lineup"
				className="mt-6 inline-block btn btn-quiet no-underline"
			>
				{m.lineup_cta()} →
			</Link>
		</Section>
	);
}
