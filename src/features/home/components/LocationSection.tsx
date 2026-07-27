import { Link } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";
import { Section } from "./Section";
import { ShuttleTables } from "./ShuttleTables";

export function LocationSection() {
	return (
		<Section
			id="anreise"
			kicker={m.location_kicker()}
			title={m.location_title()}
		>
			<p className="m-0 max-w-2xl text-moon-dim">{m.location_text()}</p>
			<h3 className="mt-8 mb-1 font-display text-xl text-moon">
				{m.shuttle_title()}
			</h3>
			<p className="m-0 max-w-2xl text-moon-dim">{m.shuttle_text()}</p>
			<div className="mt-5">
				<ShuttleTables />
			</div>
			<Link
				to="/anreise"
				className="mt-6 inline-block btn btn-quiet no-underline"
			>
				{m.nav_anreise()} →
			</Link>
		</Section>
	);
}
