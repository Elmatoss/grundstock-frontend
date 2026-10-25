import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { VideoEmbed } from "#/components/VideoEmbed";
import {
	dateRangeLabel,
	programmeDate,
	programmeDates,
} from "#/features/festival/lib/festival";
import { artistListQueryOptions } from "#/features/lineup/api/artists";
import { ArtistCard } from "#/features/lineup/components/ArtistCard";
import type { ArtistCard as ArtistCardData } from "#/features/lineup/types";
import { dayLabel } from "#/features/timetable/lib/format";
import { workshopListQueryOptions } from "#/features/workshops/api/workshops";
import { WorkshopCard } from "#/features/workshops/components/WorkshopCard";
import { localized, sanityCropUrl } from "#/lib/sanity";
import { m } from "#/paraglide/messages";
import { memoryListQueryOptions } from "../api/archive";
import { MemoryGallery } from "./MemoryGallery";

const route = getRouteApi("/archiv/$year/");

/**
 * One past festival, on one page.
 *
 * Everything that year had, in the order you would want it years later: what it
 * was, the film of it, who played, what you could learn, and the photos. Sections
 * with nothing behind them are simply absent — every edition before 2026 has only
 * an aftermovie, and a page of empty headings would read as broken rather than as
 * "that is all there is".
 *
 * There is deliberately no running-order rail here. The timetable's whole design
 * is about what is on *now* — proportional rows, live states, scroll-to-now — and
 * stripped of that it is a long duplicate of the lineup. The set times live on the
 * cards instead, which is the part people come back for.
 */
export function ArchiveYearPage() {
	const { edition } = route.useLoaderData();
	const { data: artists } = useSuspenseQuery(
		artistListQueryOptions(edition.year),
	);
	const { data: workshops } = useSuspenseQuery(
		workshopListQueryOptions(edition.year),
	);
	const { data: memories } = useSuspenseQuery(
		memoryListQueryOptions(edition.year),
	);

	const recap = localized(edition.recap);
	const isEmpty =
		artists.length === 0 &&
		workshops.length === 0 &&
		memories.length === 0 &&
		!edition.aftermovieYoutubeId;

	return (
		<main className="page-wrap flex-1 py-16 sm:py-20">
			<Link
				to="/archiv"
				className="text-sm font-semibold text-moon-dim no-underline hover:text-moon"
			>
				← {m.archive_back()}
			</Link>

			<h1 className="mt-6 mb-0 font-display text-4xl text-moon sm:text-5xl">
				Grundstock {edition.year}
			</h1>
			<p className="mt-2 mb-0 text-glow-soft">{dateRangeLabel(edition)}</p>
			{recap && (
				<p className="mt-4 mb-0 max-w-2xl text-lg text-moon-dim">{recap}</p>
			)}

			{isEmpty && (
				<p className="mt-10 inline-block badge">{m.archive_year_empty()}</p>
			)}

			{edition.aftermovieYoutubeId && (
				<section className="mt-12">
					<h2 className="m-0 font-display text-2xl text-glow-soft">
						{m.archive_aftermovie_title()}
					</h2>
					<div className="mt-5 max-w-3xl">
						<VideoEmbed
							youtubeId={edition.aftermovieYoutubeId}
							title={m.recap_title({ year: edition.year })}
							poster={
								edition.aftermoviePoster
									? sanityCropUrl(edition.aftermoviePoster, 960, 540)
									: null
							}
						/>
					</div>
				</section>
			)}

			{artists.length > 0 && (
				<section className="mt-12">
					<h2 className="m-0 font-display text-2xl text-glow-soft">
						{m.archive_lineup_title()}
					</h2>
					<Lineup
						artists={artists}
						year={edition.year}
						dates={programmeDates(edition)}
					/>
				</section>
			)}

			{workshops.length > 0 && (
				<section className="mt-12">
					<h2 className="m-0 font-display text-2xl text-glow-soft">
						{m.archive_workshops_title()}
					</h2>
					<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{workshops.map((workshop) => {
							const date = workshop.dayIndex
								? programmeDate(edition, workshop.dayIndex)
								: null;
							return (
								<WorkshopCard
									key={workshop.slug}
									workshop={workshop}
									dayLabel={date ? dayLabel(date) : null}
								/>
							);
						})}
					</div>
				</section>
			)}

			{memories.length > 0 && (
				<section className="mt-12">
					<h2 className="m-0 font-display text-2xl text-glow-soft">
						{m.archive_memories_title()}
					</h2>
					<MemoryGallery memories={memories} />
				</section>
			)}
		</main>
	);
}

/** The lineup by day, with each act's set time on its card. */
function Lineup({
	artists,
	year,
	dates,
}: {
	artists: ArtistCardData[];
	year: number;
	dates: string[];
}) {
	const unscheduled = artists.filter(
		(artist) => !artist.performances || artist.performances.length === 0,
	);

	return (
		<>
			{dates.map((date, index) => {
				const dayIndex = index + 1;
				const playing = artists.filter((artist) =>
					artist.performances?.some((p) => p.dayIndex === dayIndex),
				);
				if (playing.length === 0) return null;
				return (
					<div key={date} className="mt-5">
						<h3 className="m-0 text-xs font-semibold tracking-[0.22em] text-moon-dim uppercase">
							{dayLabel(date)}
						</h3>
						<div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{playing.map((artist) => (
								<ArtistCard
									key={artist.slug}
									artist={artist}
									archiveYear={year}
									time={setTime(artist, dayIndex)}
								/>
							))}
						</div>
					</div>
				);
			})}
			{unscheduled.length > 0 && (
				<div className="mt-5">
					<h3 className="m-0 text-xs font-semibold tracking-[0.22em] text-moon-dim uppercase">
						{m.lineup_unscheduled()}
					</h3>
					<div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{unscheduled.map((artist) => (
							<ArtistCard
								key={artist.slug}
								artist={artist}
								archiveYear={year}
							/>
						))}
					</div>
				</div>
			)}
		</>
	);
}

/**
 * "22:00–23:20 · Schepperschuppen" for the act's set on this day.
 *
 * Wall-clock strings straight from the CMS, never reformatted: they are festival
 * time, not the reader's.
 */
function setTime(artist: ArtistCardData, dayIndex: number) {
	const performance = artist.performances?.find((p) => p.dayIndex === dayIndex);
	if (!performance) return null;
	const time = performance.start
		? performance.end
			? `${performance.start}–${performance.end}`
			: performance.start
		: null;
	return [time, performance.stage?.name].filter(Boolean).join(" · ") || null;
}
