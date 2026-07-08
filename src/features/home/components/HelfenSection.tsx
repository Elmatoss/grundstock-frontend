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
					<a
						href={localizeHref("/helfen")}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 inline-block rounded-full bg-glow px-5 py-2.5 text-sm font-semibold text-night no-underline transition-colors hover:bg-glow-soft hover:text-night"
					>
						{m.helfen_shift_cta()}
					</a>
				</Card>
				<Card title={m.helfen_mittel_title()}>
					<p className="m-0">{m.helfen_mittel_text()}</p>
					<MittelgschaftlerDialog>
						<button
							type="button"
							className="mt-4 inline-block cursor-pointer rounded-full border border-glow/50 px-5 py-2.5 text-sm font-semibold text-glow-soft transition-colors hover:border-glow hover:text-glow"
						>
							{m.helfen_mittel_cta()}
						</button>
					</MittelgschaftlerDialog>
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
