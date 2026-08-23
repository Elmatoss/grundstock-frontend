import { useSuspenseQuery } from "@tanstack/react-query";
import { useFestival } from "#/features/festival/hooks/useFestival";
import { programmeDates } from "#/features/festival/lib/festival";
import type { Edition } from "#/features/festival/types";
import { dayLabel } from "#/features/timetable/lib/format";
import { m } from "#/paraglide/messages";
import { artistListQueryOptions } from "../api/artists";
import type { ArtistCard as ArtistCardData } from "../types";
import { ArtistCard } from "./ArtistCard";

export function LineupPage() {
	const { featured } = useFestival();

	return (
		<main className="page-wrap flex-1 py-16 sm:py-20">
			<p className="m-0 text-xs font-semibold tracking-[0.25em] text-glow uppercase">
				{m.lineup_kicker()}
			</p>
			<h1 className="mt-2 mb-0 font-display text-4xl text-moon sm:text-5xl">
				{m.lineup_title()}
			</h1>
			<p className="mt-4 mb-0 max-w-2xl text-moon-dim">{m.lineup_stages()}</p>

			{featured ? (
				<Lineup edition={featured} />
			) : (
				<p className="mt-10 inline-block badge">{m.festival_tba_text()}</p>
			)}
		</main>
	);
}

/**
 * The lineup of one edition, grouped by programme day.
 *
 * Split out so the page header renders whether or not there is an edition to
 * show: the query needs a year, and a hook cannot be called conditionally.
 */
function Lineup({ edition }: { edition: Edition }) {
	const { data: artists } = useSuspenseQuery(
		artistListQueryOptions(edition.year),
	);
	const unscheduled = artists.filter(
		(artist) => !artist.performances || artist.performances.length === 0,
	);

	if (artists.length === 0) {
		return <p className="mt-10 inline-block badge">{m.lineup_soon()}</p>;
	}

	return (
		<>
			{/* Days come from the edition, so a Friday–Sunday or four-day year needs
			    nothing here; the heading is the weekday of the actual date */}
			{programmeDates(edition).map((date, index) => {
				const dayIndex = index + 1;
				const dayArtists = artistsForDay(artists, dayIndex);
				if (dayArtists.length === 0) return null;
				return (
					<section key={date} className="mt-12">
						<h2 className="m-0 font-display text-2xl text-glow-soft">
							{dayLabel(date)}
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
	);
}

function artistsForDay(artists: ArtistCardData[], dayIndex: number) {
	return artists.filter((artist) =>
		artist.performances?.some(
			(performance) => performance.dayIndex === dayIndex,
		),
	);
}
