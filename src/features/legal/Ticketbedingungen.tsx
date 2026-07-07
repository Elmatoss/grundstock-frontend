import { Link } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";
import { LegalLayout } from "./LegalLayout";

// German-only static draft; moves to CMS portable text later (docs/PLAN.md §5).
export function TicketbedingungenPage() {
	return (
		<LegalLayout title={m.legal_ticketbedingungen_title()}>
			<p>
				Mit dem Kauf eines Tickets zum Grundstock 2026 stimmst du zu, dich an
				unsere <Link to="/festival-policy">Festival-Policy</Link> zu halten,
				keine verbotenen Gegenstände mitzuführen und die folgenden
				Erstattungsrichtlinien gelesen zu haben und zu akzeptieren.
			</p>

			<h2>Erstattungsrichtlinien</h2>
			<p>
				Eine Rückgabe oder Stornierung von erworbenen Tickets durch den Käufer
				ist grundsätzlich ausgeschlossen. Eine Erstattung des Kaufpreises
				erfolgt nicht.
			</p>
			<p>
				Gesetzliche Ansprüche des Käufers, insbesondere zwingende gesetzliche
				Rücktritts-, Widerrufs- oder Erstattungsrechte, bleiben von dieser
				Regelung unberührt.
			</p>
			<p>
				Sofern die Veranstaltung abgesagt wird oder eine Erstattung aufgrund
				gesetzlicher Vorschriften oder einer Entscheidung des Veranstalters
				erforderlich ist, erfolgt eine Rückerstattung ausschließlich in dem
				jeweils rechtlich vorgesehenen oder vom Veranstalter festgelegten
				Umfang.
			</p>
			<p>
				Bei einem Ausschluss vom Festival wegen grober oder wiederholter
				Verstöße gegen die <Link to="/festival-policy">Festival-Policy</Link>{" "}
				besteht kein Anspruch auf Erstattung des Ticketpreises.
			</p>

			<h2>Ticketübertragung</h2>
			<p>
				Eine Übertragung des Tickets auf eine andere Person ist nur nach
				vorheriger Abstimmung mit dem Veranstalter möglich. Der Veranstalter
				kann hierfür die Angabe der relevanten Ticket- und Personendaten
				verlangen.
			</p>
			<p>
				Anfragen zur Ticketübertragung kannst du per E-Mail an{" "}
				<a href="mailto:vorstand@neues-brett.de">vorstand@neues-brett.de</a>,
				über den Instagram-Account{" "}
				<a
					href="https://www.instagram.com/grundstock.neuesbrett/"
					target="_blank"
					rel="noopener noreferrer"
				>
					grundstock.neuesbrett
				</a>{" "}
				oder durch direkte Kontaktaufnahme mit einem dir bekannten Mitglied des
				Organisationsteams stellen. Ein Anspruch auf Zustimmung zur
				Ticketübertragung besteht nicht.
			</p>
		</LegalLayout>
	);
}
