import { useSuspenseQuery } from "@tanstack/react-query";
import { m } from "#/paraglide/messages";
import { artistListQueryOptions } from "../api/artists";
import type { ArtistCard as ArtistCardData, FestivalDay } from "../types";
import { ArtistCard } from "./ArtistCard";

const DAYS: { day: FestivalDay; label: () => string }[] = [
	{ day: "do", label: m.day_do },
	{ day: "fr", label: m.day_fr },
	{ day: "sa", label: m.day_sa },
];

function artistsForDay(artists: ArtistCardData[], day: FestivalDay) {
	return artists.filter((artist) =>
		artist.performances?.some((p) => p.day === day),
	);
}

export function LineupPage() {
	const { data: artists } = useSuspenseQuery(artistListQueryOptions);
	const unscheduled = artists.filter(
		(artist) => !artist.performances || artist.performances.length === 0,
	);

	return (
		<main className="page-wrap flex-1 py-16 sm:py-20">
			<p className="m-0 text-xs font-semibold tracking-[0.25em] text-glow uppercase">
				{m.lineup_kicker()}
			</p>
			<h1 className="mt-2 mb-0 font-display text-4xl text-moon sm:text-5xl">
				{m.lineup_title()}
			</h1>
			<p className="mt-4 mb-0 max-w-2xl text-moon-dim">{m.lineup_stages()}</p>

			{artists.length === 0 ? (
				<p className="mt-10 inline-block badge">{m.lineup_soon()}</p>
			) : (
				<>
					{DAYS.map(({ day, label }) => {
						const dayArtists = artistsForDay(artists, day);
						if (dayArtists.length === 0) return null;
						return (
							<section key={day} className="mt-12">
								<h2 className="m-0 font-display text-2xl text-glow-soft">
									{label()}
								</h2>
								<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{dayArtists.map((artist) => (
										<ArtistCard key={artist.slug} artist={artist} />
									))}
								</div>
							</section>
						);
					})}
					{unscheduled.length > 0 && (
						<section className="mt-12">
							{/* Was a decorative ✦ with the real label hidden in sr-only —
							    the heading now simply states what the group is */}
							<h2 className="m-0 font-display text-2xl text-glow-soft">
								{m.lineup_unscheduled()}
							</h2>
							<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{unscheduled.map((artist) => (
									<ArtistCard key={artist.slug} artist={artist} />
								))}
							</div>
						</section>
					)}
				</>
			)}
		</main>
	);
}
