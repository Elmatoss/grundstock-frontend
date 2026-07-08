import { Link } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";
import { getLocale } from "#/paraglide/runtime";
import { LegalLayout } from "./LegalLayout";

// Static per-locale drafts; move to CMS portable text later (docs/PLAN.md §5).
export function FestivalPolicyPage() {
	return (
		<LegalLayout title={m.legal_policy_title()}>
			{getLocale() === "en" ? <PolicyEn /> : <PolicyDe />}
		</LegalLayout>
	);
}

function PolicyDe() {
	return (
		<>
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
		</>
	);
}

function PolicyEn() {
	return (
		<>
			<p>
				By buying a ticket for Grundstock 2026 you agree to follow our festival
				policy, not to bring any prohibited items, and confirm that you have
				read and accept our <Link to="/ticketbedingungen">ticket terms</Link>.
			</p>

			<h2>Our festival policy</h2>
			<p>
				Grundstock Festival should be a place where everyone feels comfortable,
				safe and welcome — regardless of gender, gender identity, sexual
				orientation, origin, skin colour, religion, disability or appearance.
				For that to work, we need mutual respect.
			</p>

			<h3>Respect is non-negotiable</h3>
			<p>
				There is no room here for racism, sexism, antisemitism, queerphobia,
				transphobia, ableism or any other form of discrimination or inhuman
				behaviour.
			</p>
			<p>
				Treat all festival guests, artists, helpers, crew members and staff with
				respect. Mind other people's boundaries and help make sure everyone can
				feel safe and comfortable.
			</p>

			<h3>Only yes means yes</h3>
			<p>
				Physical contact and sexual advances happen only with the explicit
				consent of everyone involved. Silence, uncertainty or impairment by
				alcohol or other drugs do not mean consent. A no is to be accepted at
				any time — no discussion. Consent can also be withdrawn at any time.
			</p>

			<h3>Awareness</h3>
			<p>
				If you feel uncomfortable, are being harassed or witness a situation
				where someone's boundaries are crossed, reach out to our awareness team
				or our security. We take every report seriously and will support you.
			</p>
			<p>
				If you notice that someone else isn't doing well, don't look away. Ask
				whether help is needed, or inform our awareness team.
			</p>

			<h3>Clothing</h3>
			<p>
				Topless is only allowed at the swimming spot. On the rest of the
				festival grounds: nipples must be covered — either by clothing or by
				nipple covers or tape. This rule applies equally to all genders.
			</p>

			<h3>Consequences</h3>
			<p>
				Anyone who violates our festival policy must expect consequences. In
				cases of serious or repeated violations — especially discrimination,
				harassment, violence, abusive behaviour or disregard of boundaries — we
				reserve the right to immediately exclude you from the festival. In these
				cases there is no entitlement to a refund of the ticket price, and you
				must arrange your own departure.
			</p>

			<h3>Together we make the festival</h3>
			<p>
				A festival is made by the people who attend it. Let's make sure together
				that Grundstock Festival remains a place where everyone feels welcome,
				safe and respected. Let's celebrate with each other — not at each
				other's expense. ❤️
			</p>

			<h2>Prohibited items</h2>

			<h3>Dangerous items</h3>
			<ul>
				<li>Weapons of any kind</li>
				<li>
					Knives of any kind (exception: common camping cutlery as permitted by
					the organiser)
				</li>
				<li>Axes, hatchets, machetes and saws</li>
				<li>Striking, cutting and stabbing weapons</li>
				<li>Pepper spray, tear gas and similar defence sprays</li>
				<li>Laser pointers</li>
				<li>Pyrotechnics of any kind (fireworks, flares, smoke bombs etc.)</li>
			</ul>

			<h3>Glass and containers</h3>
			<ul>
				<li>Glass bottles</li>
				<li>Glass containers and preserving jars</li>
			</ul>

			<h3>Drugs and illegal substances</h3>
			<ul>
				<li>Illegal drugs</li>
				<li>Laughing gas (nitrous oxide)</li>
			</ul>

			<h3>Fire and camping</h3>
			<ul>
				<li>Open fire and fire pits</li>
				<li>Charcoal barbecues</li>
				<li>Gas bottles</li>
				<li>Petrol, diesel or spirit canisters</li>
				<li>Fuels of any kind</li>
			</ul>

			<h3>Other</h3>
			<ul>
				<li>Drones</li>
				<li>Confetti cannons and similar items</li>
				<li>Spray cans</li>
				<li>Pets (assistance dogs excepted)</li>
				<li>Power generators</li>
				<li>Dangerous chemicals</li>
				<li>Bulky items that obstruct escape and rescue routes</li>
				<li>
					Professional photo, film and video equipment without accreditation
				</li>
			</ul>

			<p>
				<strong>Important note:</strong> The event management reserves the right
				to prohibit or confiscate further items that could endanger or impair
				the safety or running of the event.
			</p>
		</>
	);
}
