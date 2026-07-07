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
		</Section>
	);
}
