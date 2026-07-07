import { Link } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";
import { LegalLayout } from "./LegalLayout";

// German-only static draft; moves to CMS portable text later (docs/PLAN.md §5).
export function FestivalPolicyPage() {
	return (
		<LegalLayout title={m.legal_policy_title()}>
			<p>
				Mit dem Kauf eines Tickets zum Grundstock 2026 stimmst du zu, dich an
				unsere Festival-Policy zu halten, keine verbotenen Gegenstände
				mitzuführen und unsere{" "}
				<Link to="/ticketbedingungen">Ticketbedingungen</Link> gelesen zu haben
				und zu akzeptieren.
			</p>

			<h2>Unsere Festival-Policy</h2>
			<p>
				Das Grundstock Festival soll ein Ort sein, an dem sich alle Menschen
				wohl, sicher und willkommen fühlen — unabhängig von Geschlecht,
				geschlechtlicher Identität, sexueller Orientierung, Herkunft, Hautfarbe,
				Religion, Behinderung oder Aussehen. Damit das gelingt, brauchen wir
				gegenseitigen Respekt.
			</p>

			<h3>Respekt ist nicht verhandelbar</h3>
			<p>
				Bei uns ist kein Platz für Rassismus, Sexismus, Antisemitismus,
				Queerfeindlichkeit, Transfeindlichkeit, Ableismus oder jede andere Form
				von Diskriminierung und menschenfeindlichem Verhalten.
			</p>
			<p>
				Behandle alle Festivalbesucher*innen, Künstler*innen, Helfer*innen,
				Crew-Mitglieder und Mitarbeitenden respektvoll. Achte auf die Grenzen
				anderer Menschen und trage dazu bei, dass sich alle sicher und
				wohlfühlen können.
			</p>

			<h3>Nur Ja heißt Ja</h3>
			<p>
				Körperkontakt und sexuelle Annäherungen finden ausschließlich mit der
				ausdrücklichen Zustimmung aller beteiligten Personen statt. Schweigen,
				Unsicherheit oder eine Beeinträchtigung durch Alkohol oder andere Drogen
				bedeuten keine Zustimmung. Ein Nein ist jederzeit zu akzeptieren — ohne
				Diskussion. Zustimmung kann außerdem jederzeit zurückgezogen werden.
			</p>

			<h3>Awareness</h3>
			<p>
				Wenn du dich unwohl fühlst, belästigt wirst oder eine
				grenzüberschreitende Situation beobachtest, wende dich an unser
				Awareness-Team oder unsere Security. Wir nehmen jede Meldung ernst und
				unterstützen dich.
			</p>
			<p>
				Wenn du bemerkst, dass es einer anderen Person nicht gut geht, schau
				nicht weg. Frag nach, ob Hilfe benötigt wird, oder informiere unser
				Awareness-Team.
			</p>

			<h3>Kleidung</h3>
			<p>
				Oben ohne ist ausschließlich an der Badestelle erlaubt. Auf dem
				restlichen Festivalgelände gilt: Brustwarzen müssen bedeckt sein —
				entweder durch Kleidung oder durch Nippel-Cover bzw. Tape. Diese Regel
				gilt für alle Geschlechter gleichermaßen.
			</p>

			<h3>Konsequenzen</h3>
			<p>
				Wer gegen unsere Festival-Policy verstößt, muss mit Konsequenzen
				rechnen. Bei groben oder wiederholten Verstößen — insbesondere bei
				Diskriminierung, Belästigung, Gewalt, übergriffigem Verhalten oder der
				Missachtung von Grenzen — behalten wir uns einen sofortigen Ausschluss
				vom Festival vor. In diesen Fällen besteht kein Anspruch auf Erstattung
				des Ticketpreises; um die Abreise muss sich zudem eigenständig gekümmert
				werden.
			</p>

			<h3>Gemeinsam machen wir das Festival aus</h3>
			<p>
				Ein Festival lebt von den Menschen, die es besuchen. Lasst uns gemeinsam
				dafür sorgen, dass das Grundstock Festival ein Ort bleibt, an dem sich
				alle willkommen, sicher und respektiert fühlen. Feiern wir miteinander —
				nicht auf Kosten anderer. ❤️
			</p>

			<h2>Verbotene Gegenstände</h2>

			<h3>Gefährliche Gegenstände</h3>
			<ul>
				<li>Waffen aller Art</li>
				<li>
					Messer aller Art (Ausnahme: übliche Campingbestecke nach
					Veranstalterregelung)
				</li>
				<li>Äxte, Beile, Macheten und Sägen</li>
				<li>Schlag-, Hieb- und Stichwaffen</li>
				<li>Pfefferspray, Reizgas und ähnliche Abwehrsprays</li>
				<li>Laserpointer</li>
				<li>
					Pyrotechnik aller Art (Feuerwerkskörper, Bengalos, Rauchbomben etc.)
				</li>
			</ul>

			<h3>Glas und Behälter</h3>
			<ul>
				<li>Glasflaschen</li>
				<li>Glasbehälter und Einmachgläser</li>
			</ul>

			<h3>Drogen und illegale Substanzen</h3>
			<ul>
				<li>Illegale Drogen</li>
				<li>Lachgas</li>
			</ul>

			<h3>Feuer und Camping</h3>
			<ul>
				<li>Offenes Feuer und Feuerstellen</li>
				<li>Holzkohlegrills</li>
				<li>Gasflaschen</li>
				<li>Benzin-, Diesel- oder Spirituskanister</li>
				<li>Brennstoffe aller Art</li>
			</ul>

			<h3>Sonstiges</h3>
			<ul>
				<li>Drohnen</li>
				<li>Konfettikanonen und ähnliche Gegenstände</li>
				<li>Spraydosen</li>
				<li>Haustiere (ausgenommen Assistenzhunde)</li>
				<li>Stromgeneratoren</li>
				<li>Gefährliche Chemikalien</li>
				<li>Sperrige Gegenstände, die Flucht- und Rettungswege behindern</li>
				<li>
					Professionelle Foto-, Film- und Videoausrüstung ohne Akkreditierung
				</li>
			</ul>

			<p>
				<strong>Wichtiger Hinweis:</strong> Die Veranstaltungsleitung behält
				sich das Recht vor, weitere Gegenstände, die die Sicherheit oder den
				Ablauf der Veranstaltung gefährden oder beeinträchtigen können, zu
				untersagen oder einzuziehen.
			</p>
		</LegalLayout>
	);
}
