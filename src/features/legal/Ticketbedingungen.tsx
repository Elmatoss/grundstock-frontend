import { Link } from "@tanstack/react-router";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";
import { getLocale } from "#/paraglide/runtime";
import { LegalLayout } from "./LegalLayout";

// Static per-locale drafts; move to CMS portable text later (docs/PLAN.md §5).
export function TicketbedingungenPage() {
	return (
		<LegalLayout title={m.legal_ticketbedingungen_title()}>
			{getLocale() === "en" ? <TermsEn /> : <TermsDe />}
		</LegalLayout>
	);
}

function TermsDe() {
	return (
		<>
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
				<a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
					grundstock.neuesbrett
				</a>{" "}
				oder durch direkte Kontaktaufnahme mit einem dir bekannten Mitglied des
				Organisationsteams stellen. Ein Anspruch auf Zustimmung zur
				Ticketübertragung besteht nicht.
			</p>
		</>
	);
}

function TermsEn() {
	return (
		<>
			<p>
				By buying a ticket for Grundstock 2026 you agree to follow our{" "}
				<Link to="/festival-policy">festival policy</Link>, not to bring any
				prohibited items, and confirm that you have read and accept the
				following refund policy.
			</p>

			<h2>Refund policy</h2>
			<p>
				Returns or cancellations of purchased tickets by the buyer are generally
				excluded. The purchase price is not refunded.
			</p>
			<p>
				The buyer's statutory claims, in particular mandatory statutory rights
				of withdrawal, revocation or reimbursement, remain unaffected by this
				provision.
			</p>
			<p>
				If the event is cancelled or a refund is required by law or by a
				decision of the organiser, reimbursement is made exclusively to the
				extent provided by law or determined by the organiser.
			</p>
			<p>
				If you are excluded from the festival due to serious or repeated
				violations of the <Link to="/festival-policy">festival policy</Link>,
				there is no entitlement to a refund of the ticket price.
			</p>

			<h2>Ticket transfer</h2>
			<p>
				Transferring a ticket to another person is only possible after prior
				agreement with the organiser. The organiser may require the relevant
				ticket and personal data for this.
			</p>
			<p>
				You can request a ticket transfer by email to{" "}
				<a href="mailto:vorstand@neues-brett.de">vorstand@neues-brett.de</a>,
				via the Instagram account{" "}
				<a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
					grundstock.neuesbrett
				</a>{" "}
				or by directly contacting a member of the organising team known to you.
				There is no entitlement to approval of a ticket transfer.
			</p>
		</>
	);
}
