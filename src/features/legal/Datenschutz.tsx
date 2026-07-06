import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";
import { LegalLayout } from "./LegalLayout";

// German-only static draft; moves to CMS portable text in Phase 2 (docs/PLAN.md §5).
// TODO before launch: replace the address placeholder with the ladungsfähige Anschrift.
export function DatenschutzPage() {
	return (
		<LegalLayout title={m.legal_datenschutz_title()}>
			<h2>1. Verantwortlicher</h2>
			<p>
				Neues Brett e.V.
				<br />
				<strong>[Ladungsfähige Anschrift wird nachgetragen]</strong>
				<br />
				E-Mail: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
			</p>
			<h2>2. Hosting und Server-Logdateien</h2>
			<p>
				Diese Website wird bei Cloudflare gehostet (Cloudflare Germany GmbH,
				Rosental 7, 80331 München, bzw. Cloudflare, Inc., USA). Beim Aufruf der
				Website verarbeitet Cloudflare technisch notwendige Daten wie
				IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite und
				Browser-Informationen, um die Website auszuliefern und vor Angriffen zu
				schützen. Rechtsgrundlage ist unser berechtigtes Interesse an einem
				sicheren und performanten Betrieb (Art. 6 Abs. 1 lit. f DSGVO). Soweit
				Daten in die USA übertragen werden, stützt sich Cloudflare auf
				EU-Standardvertragsklauseln und das EU-US Data Privacy Framework.
			</p>
			<h2>3. Keine Cookies, kein Tracking</h2>
			<p>
				Diese Website setzt keine Cookies und erstellt keine Nutzungsprofile.
				Zur anonymen Reichweitenmessung nutzen wir Cloudflare Web Analytics —
				ein cookiefreies Verfahren, das keine personenbezogenen Daten speichert,
				keine Nutzer:innen über Websites hinweg verfolgt und keine Einwilligung
				erfordert.
			</p>
			<h2>4. YouTube-Video (Zwei-Klick-Lösung)</h2>
			<p>
				Auf der Startseite binden wir ein Video über YouTube ein. Das Video wird
				erst geladen, wenn du aktiv auf „Abspielen“ klickst — vorher wird keine
				Verbindung zu YouTube aufgebaut. Mit dem Klick werden Daten (u.&nbsp;a.
				deine IP-Adresse) an Google Ireland Limited bzw. Google LLC (USA)
				übertragen. Wir nutzen den erweiterten Datenschutzmodus
				(youtube-nocookie.com). Rechtsgrundlage ist deine Einwilligung durch den
				Klick (Art. 6 Abs. 1 lit. a DSGVO). Weitere Informationen findest du in
				der{" "}
				<a
					href="https://policies.google.com/privacy"
					target="_blank"
					rel="noopener noreferrer"
				>
					Datenschutzerklärung von Google
				</a>
				.
			</p>
			<h2>5. Externe Links</h2>
			<p>
				Tickets verkaufen wir über Eventfrog, Helfer-Schichten organisieren wir
				über Airtable-Formulare. Beide sind eigenständige Angebote Dritter mit
				eigenen Datenschutzerklärungen; beim Klick auf die entsprechenden Links
				verlässt du unsere Website.
			</p>
			<h2>6. Kontakt per E-Mail</h2>
			<p>
				Wenn du uns per E-Mail kontaktierst, verarbeiten wir deine Angaben zur
				Beantwortung der Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Die Daten
				löschen wir, sobald sie für diesen Zweck nicht mehr erforderlich sind.
			</p>
			<h2>7. Deine Rechte</h2>
			<p>
				Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16),
				Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
				Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf
				Grundlage berechtigter Interessen (Art. 21). Außerdem kannst du dich bei
				einer Datenschutz-Aufsichtsbehörde beschweren — in Bayern ist das das
				Bayerische Landesamt für Datenschutzaufsicht (BayLDA), Ansbach.
			</p>
			<p>Stand: Juli 2026</p>
		</LegalLayout>
	);
}
