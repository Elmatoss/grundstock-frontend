import { m } from "#/paraglide/messages";
import { Card } from "./Card";
import { Section } from "./Section";

export function InclusiveSection() {
	return (
		<Section kicker={m.inclusive_kicker()} title={m.inclusive_title()}>
			<div className="grid gap-4 sm:grid-cols-3">
				<Card title={m.inclusive_food_title()}>
					<p className="m-0">{m.inclusive_food_text()}</p>
				</Card>
				<Card title={m.inclusive_snack_title()}>
					<p className="m-0">{m.inclusive_snack_text()}</p>
				</Card>
				<Card title={m.inclusive_drinks_title()}>
					<p className="m-0">{m.inclusive_drinks_text()}</p>
				</Card>
			</div>
			<p className="m-0 mt-4 rounded-xl border border-glow/40 bg-glow/10 p-5 text-moon">
				<strong className="font-display text-glow-soft">
					{m.inclusive_dishes_title()}
				</strong>{" "}
				{m.inclusive_dishes_text()}
			</p>
		</Section>
	);
}
