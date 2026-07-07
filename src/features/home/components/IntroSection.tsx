import { m } from "#/paraglide/messages";
import { Section } from "./Section";

export function IntroSection() {
	return (
		<Section id="intro" kicker={m.intro_kicker()} title={m.intro_title()}>
			<p className="m-0 max-w-2xl text-lg leading-relaxed text-moon-dim">
				{m.intro_text()}
			</p>
		</Section>
	);
}
