import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";
import { LegalLayout } from "./LegalLayout";

// German-only static draft; moves to CMS portable text in Phase 2 (docs/PLAN.md §5).
// TODO before launch: replace the address placeholder with the ladungsfähige Anschrift.
export function ImpressumPage() {
	return (
		<LegalLayout title={m.legal_impressum_title()}>
			<h2>Angaben gemäß § 5 DDG</h2>
			<p>
				Neues Brett e.V.
				<br />
				<strong>[Ladungsfähige Anschrift wird nachgetragen]</strong>
			</p>
			<p>
				Vertreten durch den Vorstand (§ 26 BGB):
				<br />
				Vinzenz Abt und Max Pindl
			</p>
			<h2>Vereinsregister</h2>
			<p>
				Registernummer: VR 201964
				<br />
				Registergericht: Amtsgericht Regensburg
			</p>
			<h2>Kontakt</h2>
			<p>
				E-Mail: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
			</p>
			<h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
			<p>Der Vorstand des Neues Brett e.V. (Anschrift wie oben)</p>
			<h2>Verbraucherstreitbeilegung</h2>
			<p>
				Wir sind nicht bereit und nicht verpflichtet, an
				Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
				teilzunehmen (§ 36 VSBG).
			</p>
			<h2>Haftung für Links</h2>
			<p>
				Unsere Website enthält Links zu externen Websites Dritter (z.&nbsp;B.
				Ticketshop und Helfertool), auf deren Inhalte wir keinen Einfluss haben.
				Für diese fremden Inhalte übernehmen wir keine Gewähr; verantwortlich
				ist stets der jeweilige Anbieter.
			</p>
		</LegalLayout>
	);
}
