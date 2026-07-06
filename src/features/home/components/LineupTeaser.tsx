import { m } from "#/paraglide/messages";
import { Section } from "./Section";

export function LineupTeaser() {
	return (
		<Section id="lineup" kicker={m.lineup_kicker()} title={m.lineup_title()}>
			<div className="max-w-2xl space-y-4 text-moon-dim">
				<p className="m-0">{m.lineup_text()}</p>
				<p className="m-0">{m.lineup_stages()}</p>
			</div>
			<p className="mt-6 inline-block rounded-full border border-glow/40 bg-glow/10 px-4 py-2 font-display text-sm font-semibold text-glow-soft">
				{m.lineup_soon()}
			</p>
		</Section>
	);
}
