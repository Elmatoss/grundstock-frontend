import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";
import { getLocale } from "#/paraglide/runtime";
import { LegalLayout } from "./LegalLayout";

// Static per-locale drafts; move to CMS portable text later (docs/PLAN.md §5).
export function DatenschutzPage() {
	return (
		<LegalLayout title={m.legal_datenschutz_title()}>
			{getLocale() === "en" ? <PrivacyEn /> : <PrivacyDe />}
		</LegalLayout>
	);
}

function PrivacyDe() {
	return (
		<>
			<h2>1. Verantwortlicher</h2>
			<p>
				Neues Brett e.V.
				<br />
				Bischof-Konrad-Str. 23
				<br />
				93051 Regensburg
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
			<h2>3. Kein Tracking, ein funktionales Cookie</h2>
			<p>
				Diese Website erstellt keine Nutzungsprofile und setzt keine
				Tracking-Cookies. Zur anonymen Reichweitenmessung nutzen wir Cloudflare
				Web Analytics — ein cookiefreies Verfahren, das keine personenbezogenen
				Daten speichert, keine Nutzer:innen über Websites hinweg verfolgt und
				keine Einwilligung erfordert.
			</p>
			<p>
				Zur Sprachwahl wertet die Website die Spracheinstellung deines Browsers
				(Accept-Language-Header) aus, ohne sie zu speichern. Wenn du die Sprache
				über den Sprachumschalter wechselst, speichert dein Browser diese
				Auswahl in einem rein funktionalen Cookie (PARAGLIDE_LOCALE,
				Speicherdauer ca. 400 Tage). Es enthält nur das Sprachkürzel und dient
				ausschließlich dazu, dir die Website in der gewählten Sprache anzuzeigen
				(§ 25 Abs. 2 Nr. 2 TDDDG, Art. 6 Abs. 1 lit. f DSGVO).
			</p>
			<h2>4. Bilder-CDN (Sanity)</h2>
			<p>
				Bilder auf dieser Website (z.&nbsp;B. Artist-Fotos) liefern wir über das
				Content Delivery Network von Sanity aus (Sanity Inc., San Francisco,
				USA; cdn.sanity.io). Beim Laden eines Bildes erhält Sanity technisch
				bedingt deine IP-Adresse. Rechtsgrundlage ist unser berechtigtes
				Interesse an einer schnellen und zuverlässigen Auslieferung der Inhalte
				(Art. 6 Abs. 1 lit. f DSGVO). Soweit dabei Daten in die USA übertragen
				werden, stützt sich Sanity auf EU-Standardvertragsklauseln.
			</p>
			<h2>5. YouTube-Video (Zwei-Klick-Lösung)</h2>
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
			<h2>6. Externe Links</h2>
			<p>
				Tickets verkaufen wir über Eventfrog, Helfer-Schichten organisieren wir
				über Airtable-Formulare. Beide sind eigenständige Angebote Dritter mit
				eigenen Datenschutzerklärungen; beim Klick auf die entsprechenden Links
				verlässt du unsere Website.
			</p>
			<h2>7. Kontakt per E-Mail</h2>
			<p>
				Wenn du uns per E-Mail kontaktierst, verarbeiten wir deine Angaben zur
				Beantwortung der Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Die Daten
				löschen wir, sobald sie für diesen Zweck nicht mehr erforderlich sind.
			</p>
			<h2>8. Deine Rechte</h2>
			<p>
				Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16),
				Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
				Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf
				Grundlage berechtigter Interessen (Art. 21). Außerdem kannst du dich bei
				einer Datenschutz-Aufsichtsbehörde beschweren — in Bayern ist das das
				Bayerische Landesamt für Datenschutzaufsicht (BayLDA), Ansbach.
			</p>
			<p>Stand: Juli 2026</p>
		</>
	);
}

function PrivacyEn() {
	return (
		<>
			<h2>1. Controller</h2>
			<p>
				Neues Brett e.V.
				<br />
				Bischof-Konrad-Str. 23
				<br />
				93051 Regensburg, Germany
				<br />
				Email: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
			</p>
			<h2>2. Hosting and server log files</h2>
			<p>
				This website is hosted by Cloudflare (Cloudflare Germany GmbH, Rosental
				7, 80331 Munich, and Cloudflare, Inc., USA). When you visit the website,
				Cloudflare processes technically necessary data such as your IP address,
				date and time of access, the page requested and browser information in
				order to deliver the website and protect it against attacks. The legal
				basis is our legitimate interest in secure and performant operation
				(Art. 6(1)(f) GDPR). Where data is transferred to the USA, Cloudflare
				relies on EU standard contractual clauses and the EU-US Data Privacy
				Framework.
			</p>
			<h2>3. No tracking, one functional cookie</h2>
			<p>
				This website does not create usage profiles and does not set tracking
				cookies. For anonymous reach measurement we use Cloudflare Web Analytics
				— a cookie-free method that stores no personal data, does not track
				users across websites and requires no consent.
			</p>
			<p>
				To choose a language, the website evaluates your browser's language
				setting (Accept-Language header) without storing it. If you change the
				language via the language switcher, your browser stores this choice in a
				purely functional cookie (PARAGLIDE_LOCALE, retained for about 400
				days). It contains only the language code and serves exclusively to show
				you the website in your chosen language (Section 25(2)(2) TDDDG, Art.
				6(1)(f) GDPR).
			</p>
			<h2>4. Image CDN (Sanity)</h2>
			<p>
				Images on this website (e.g. artist photos) are delivered via the
				content delivery network of Sanity (Sanity Inc., San Francisco, USA;
				cdn.sanity.io). When an image is loaded, Sanity technically receives
				your IP address. The legal basis is our legitimate interest in fast and
				reliable delivery of content (Art. 6(1)(f) GDPR). Where data is
				transferred to the USA, Sanity relies on EU standard contractual
				clauses.
			</p>
			<h2>5. YouTube video (two-click solution)</h2>
			<p>
				On the homepage we embed a video via YouTube. The video is only loaded
				once you actively click "Play" — before that, no connection to YouTube
				is established. With the click, data (including your IP address) is
				transferred to Google Ireland Limited or Google LLC (USA). We use the
				extended privacy mode (youtube-nocookie.com). The legal basis is your
				consent given by the click (Art. 6(1)(a) GDPR). You can find more
				information in{" "}
				<a
					href="https://policies.google.com/privacy"
					target="_blank"
					rel="noopener noreferrer"
				>
					Google's privacy policy
				</a>
				.
			</p>
			<h2>6. External links</h2>
			<p>
				We sell tickets via Eventfrog and organise helper shifts via Airtable
				forms. Both are independent third-party services with their own privacy
				policies; clicking the corresponding links takes you off our website.
			</p>
			<h2>7. Contact by email</h2>
			<p>
				If you contact us by email, we process your details to answer your
				enquiry (Art. 6(1)(b) or (f) GDPR). We delete the data as soon as it is
				no longer required for this purpose.
			</p>
			<h2>8. Your rights</h2>
			<p>
				You have the right of access (Art. 15 GDPR), rectification (Art. 16),
				erasure (Art. 17), restriction of processing (Art. 18), data portability
				(Art. 20) and objection to processing based on legitimate interests
				(Art. 21). You can also lodge a complaint with a data protection
				supervisory authority — in Bavaria this is the Bavarian State Office for
				Data Protection Supervision (BayLDA), Ansbach.
			</p>
			<p>Last updated: July 2026</p>
		</>
	);
}
