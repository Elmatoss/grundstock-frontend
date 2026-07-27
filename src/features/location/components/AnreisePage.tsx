import { ShuttleTables } from "#/features/home/components/ShuttleTables";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

const a = site.anreise;

const externalLink =
	"mt-4 inline-block rounded-xs border border-glow/40 bg-glow/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-glow-soft uppercase no-underline transition-colors hover:border-glow hover:text-glow";

// Numbered options mirror the An-/Abreise briefing, so someone holding the PDF
// and someone reading the site are looking at the same four routes in the same
// order.
function Option({
	index,
	title,
	children,
}: {
	index: number;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="mt-14 border-t border-border pt-8">
			<p className="m-0 text-xs font-semibold tracking-[0.25em] text-glow uppercase">
				{m.anreise_option_label()} {String(index).padStart(2, "0")}
			</p>
			<h2 className="mt-2 mb-0 font-display text-3xl text-moon">{title}</h2>
			<div className="mt-4 max-w-2xl text-moon-dim">{children}</div>
		</section>
	);
}

export function AnreisePage() {
	return (
		<main className="page-wrap flex-1 py-16 sm:py-20">
			<p className="m-0 text-xs font-semibold tracking-[0.25em] text-glow uppercase">
				{m.location_kicker()}
			</p>
			<h1 className="mt-2 mb-0 font-display text-4xl text-moon sm:text-5xl">
				{m.nav_anreise()}
			</h1>
			<p className="mt-4 mb-0 max-w-2xl text-lg text-moon-dim">
				{m.anreise_intro()}
			</p>
			{/* Official Maps search URL — opens the Maps app on phones */}
			<a
				href={a.mapsUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="mt-5 inline-block rounded-xs border border-moon-dim/40 px-5 py-2.5 text-sm font-semibold text-moon no-underline transition-colors hover:border-glow hover:text-glow"
			>
				{m.anreise_map_cta()} →
			</a>

			<Option index={1} title={m.anreise_shuttle_title()}>
				<p className="m-0">
					{m.anreise_shuttle_text({
						stop: a.shuttleStop,
						price: a.shuttlePriceEur,
					})}
				</p>
				<div className="mt-6 max-w-none">
					<ShuttleTables />
				</div>
			</Option>

			<Option index={2} title={m.anreise_oepnv_title()}>
				<p className="m-0">
					{m.anreise_oepnv_text({ lines: a.busLines, stop: a.busStop })}
				</p>
				<a
					href={a.znasTimetableUrl}
					target="_blank"
					rel="noopener noreferrer"
					className={externalLink}
				>
					{m.anreise_oepnv_cta()} →
				</a>
			</Option>

			<Option index={3} title={m.anreise_rad_title()}>
				<p className="m-0">{m.anreise_rad_text({ road: a.bikeRoad })}</p>
				<div className="inner-edge mt-6 rounded-xs border border-border bg-night-soft/50 p-5">
					<h3 className="m-0 font-display text-xl text-moon">
						{m.anreise_rad_tour_title()}
					</h3>
					<p className="mt-2 mb-0">{m.anreise_rad_tour_text()}</p>
					<a
						href={a.whatsappBikeTour}
						target="_blank"
						rel="noopener noreferrer"
						className={externalLink}
					>
						{m.anreise_rad_tour_cta()} →
					</a>
				</div>
			</Option>

			<Option index={4} title={m.anreise_auto_title()}>
				<p className="m-0">{m.anreise_auto_text({ place: a.parkingPlace })}</p>
				<a
					href={a.whatsappCarpool}
					target="_blank"
					rel="noopener noreferrer"
					className={externalLink}
				>
					{m.anreise_auto_carpool_cta()} →
				</a>
				<p className="mt-5 mb-0">{m.anreise_auto_overflow()}</p>
				<p className="mt-4 mb-0 font-semibold text-moon">
					{m.anreise_auto_nodrive()}
				</p>
				<p className="mt-4 mb-0">
					{m.anreise_auto_onward({ lines: a.busLines, stop: a.busStop })}
				</p>
				<a
					href={a.whatsappParkingShuttle}
					target="_blank"
					rel="noopener noreferrer"
					className={externalLink}
				>
					{m.anreise_auto_shuttle_cta()} →
				</a>

				{/* Not a nice-to-have: there is genuinely no legal way to walk in, so
				    this has to be impossible to skim past */}
				<div className="inner-glow mt-8 rounded-xs border border-glow/30 bg-night-soft p-5">
					<h3 className="m-0 font-display text-xl text-glow-soft">
						{m.anreise_warning_title()}
					</h3>
					<p className="mt-2 mb-0 text-moon">{m.anreise_warning_text()}</p>
				</div>
			</Option>

			<section className="mt-16 border-t border-border pt-8">
				<h2 className="m-0 font-display text-3xl text-moon">
					{m.abreise_title()}
				</h2>
				<p className="mt-4 mb-0 max-w-2xl text-moon-dim">{m.abreise_text()}</p>

				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					<div className="inner-edge rounded-xs border border-border bg-night-soft/50 p-5">
						<h3 className="m-0 font-display text-xl text-moon">
							{m.abreise_night_title()}
						</h3>
						<p className="mt-2 mb-0 text-moon-dim">
							{m.abreise_night_text({ route: a.nightExitRoute })}
						</p>
					</div>
					<div className="inner-edge rounded-xs border border-border bg-night-soft/50 p-5">
						<h3 className="m-0 font-display text-xl text-moon">
							{m.abreise_abbau_title()}
						</h3>
						<p className="mt-2 mb-0 text-moon-dim">{m.abreise_abbau_text()}</p>
					</div>
				</div>
			</section>

			<section className="mt-16 max-w-2xl border-t border-border pt-8">
				<h2 className="m-0 font-display text-2xl text-moon">
					{m.anreise_camping_title()}
				</h2>
				<p className="mt-3 mb-0 text-moon-dim">{m.anreise_camping_text()}</p>
			</section>
		</main>
	);
}
