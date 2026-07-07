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
		</Section>
	);
}
