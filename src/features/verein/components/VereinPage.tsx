import { useState } from "react";
import { MittelgschaftlerDialog } from "#/components/MittelgschaftlerDialog";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";
import { localizeHref } from "#/paraglide/runtime";

function CopyIbanButton() {
	const [copied, setCopied] = useState(false);

	return (
		<button
			type="button"
			onClick={() => {
				navigator.clipboard.writeText(site.donation.iban.replaceAll(" ", ""));
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}}
			className="btn btn-quiet"
		>
			{copied ? m.verein_iban_copied() : m.verein_iban_copy()}
		</button>
	);
}

export function VereinPage() {
	return (
		<main className="page-wrap flex-1 py-16 sm:py-20">
			<p className="m-0 text-xs font-semibold tracking-[0.25em] text-glow uppercase">
				Neues Brett e.V.
			</p>
			<h1 className="mt-2 mb-0 font-display text-4xl text-moon sm:text-5xl">
				{m.verein_title()}
			</h1>
			<p className="mt-4 mb-0 max-w-2xl text-lg text-moon-dim">
				{m.verein_intro()}
			</p>

			<section className="mt-12 max-w-2xl">
				<h2 className="m-0 font-display text-2xl text-moon">
					{m.verein_values_title()}
				</h2>
				<p className="mt-3 mb-0 text-moon-dim">{m.verein_values_text()}</p>
			</section>

			<section className="mt-12 max-w-2xl">
				<h2 className="m-0 font-display text-2xl text-moon">
					{m.verein_mitmachen_title()}
				</h2>
				<p className="mt-3 mb-0 text-moon-dim">{m.verein_mitmachen_text()}</p>
				<div className="mt-5 flex flex-wrap gap-3">
					<a
						href={localizeHref("/helfen")}
						target="_blank"
						rel="noopener noreferrer"
						className="btn btn-primary no-underline"
					>
						{m.verein_mitmachen_schicht()}
					</a>
					<MittelgschaftlerDialog>
						<button type="button" className="btn btn-secondary">
							{m.verein_mitmachen_mittel()}
						</button>
					</MittelgschaftlerDialog>
				</div>
			</section>

			<section id="spenden" className="mt-12 max-w-2xl scroll-mt-24">
				<h2 className="m-0 font-display text-2xl text-moon">
					{m.verein_spenden_title()}
				</h2>
				<p className="mt-3 mb-0 text-moon-dim">{m.verein_spenden_text()}</p>
				<div className="mt-5 rounded-xs border border-border bg-night-soft/50 p-5">
					<p className="m-0 font-semibold text-moon">
						{site.donation.accountHolder}
					</p>
					<div className="mt-2 flex flex-wrap items-center gap-3">
						<code className="text-glow-soft tabular-nums">
							{site.donation.iban}
						</code>
						<CopyIbanButton />
					</div>
				</div>
				<p className="mt-4 mb-0 text-sm text-moon-dim">
					{m.verein_spenden_receipt({ email: site.contactEmail })}
				</p>
			</section>

			<section className="mt-12 max-w-2xl">
				<h2 className="m-0 font-display text-2xl text-moon">
					{m.verein_kontakt_title()}
				</h2>
				<p className="mt-3 mb-0 text-moon-dim">
					{m.verein_kontakt_text()}{" "}
					<a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
				</p>
			</section>
		</main>
	);
}
