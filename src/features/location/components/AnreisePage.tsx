import { ShuttleTables } from "#/features/home/components/ShuttleTables";
import { m } from "#/paraglide/messages";

const OSM_SEARCH_URL =
	"https://www.openstreetmap.org/search?query=Vilsw%C3%B6rth%20Rieden";

export function AnreisePage() {
	return (
		<main className="page-wrap flex-1 py-16 sm:py-20">
			<p className="m-0 font-display text-sm font-semibold tracking-[0.2em] text-glow uppercase">
				{m.location_kicker()}
			</p>
			<h1 className="mt-2 mb-0 font-display text-4xl font-bold text-moon sm:text-5xl">
				{m.nav_anreise()}
			</h1>
			<p className="mt-4 mb-0 max-w-2xl text-lg text-moon-dim">
				{m.anreise_intro()}
			</p>
			<a
				href={OSM_SEARCH_URL}
				target="_blank"
				rel="noopener noreferrer"
				className="mt-5 inline-block rounded-full border border-moon-dim/40 px-5 py-2.5 text-sm font-semibold text-moon no-underline transition-colors hover:border-glow hover:text-glow"
			>
				{m.anreise_map_cta()} →
			</a>

			<section className="mt-12">
				<h2 className="m-0 font-display text-2xl font-bold text-moon">
					{m.shuttle_title()}
				</h2>
				<p className="mt-3 mb-5 max-w-2xl text-moon-dim">{m.shuttle_text()}</p>
				<ShuttleTables />
			</section>

			<section className="mt-12 max-w-2xl">
				<h2 className="m-0 font-display text-2xl font-bold text-moon">
					{m.anreise_auto_title()}
				</h2>
				<p className="mt-3 mb-0 text-moon-dim">{m.anreise_auto_text()}</p>
			</section>

			<section className="mt-12 max-w-2xl">
				<h2 className="m-0 font-display text-2xl font-bold text-moon">
					{m.anreise_camping_title()}
				</h2>
				<p className="mt-3 mb-0 text-moon-dim">{m.anreise_camping_text()}</p>
			</section>
		</main>
	);
}
