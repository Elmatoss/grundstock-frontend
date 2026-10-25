import { ComingSoon } from "#/components/ComingSoon";
import { MittelgschaftlerDialog } from "#/components/MittelgschaftlerDialog";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";
import { localizeHref } from "#/paraglide/runtime";
import { Card } from "./Card";
import { Section } from "./Section";

export function HelfenSection() {
	return (
		<Section id="helfen" kicker={m.helfen_kicker()} title={m.helfen_title()}>
			<p className="m-0 max-w-2xl text-moon-dim">{m.helfen_text()}</p>
			<div className="mt-6 grid gap-4 sm:grid-cols-2">
				<Card title={m.helfen_shift_title()}>
					<p className="m-0">{m.helfen_shift_text()}</p>
					{site.helfertoolUrl ? (
						<a
							href={localizeHref("/helfen")}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-4 btn btn-primary no-underline"
						>
							{m.helfen_shift_cta()}
						</a>
					) : (
						<ComingSoon className="mt-4" />
					)}
				</Card>
				<Card title={m.helfen_mittel_title()}>
					<p className="m-0">{m.helfen_mittel_text()}</p>
					{site.mittelgschaftlerEmail ? (
						<MittelgschaftlerDialog email={site.mittelgschaftlerEmail}>
							<button type="button" className="mt-4 btn btn-secondary">
								{m.helfen_mittel_cta()}
							</button>
						</MittelgschaftlerDialog>
					) : (
						<ComingSoon className="mt-4" />
					)}
				</Card>
			</div>
			<p className="mt-6 max-w-2xl text-sm text-moon-dim/80">
				{m.helfen_donate_text({
					accountHolder: site.donation.accountHolder,
					iban: site.donation.iban,
					email: site.contactEmail,
				})}
			</p>
		</Section>
	);
}
