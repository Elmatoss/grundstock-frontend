import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
	dateRangeLabel,
	selectFestivalMode,
} from "#/features/festival/lib/festival";
import { sanityCropUrl } from "#/lib/sanity";
import { m } from "#/paraglide/messages";
import { editionSummaryListQueryOptions } from "../api/archive";
import type { EditionSummary } from "../types";

/**
 * Every festival that has been, newest first.
 *
 * The edition currently on display is deliberately absent: while no new year is
 * announced the last festival still *is* the site, so listing it here would point
 * at a second copy of the same lineup. It appears the moment a new year takes
 * over the main pages.
 */
export function ArchiveIndexPage() {
	const { data: editions } = useSuspenseQuery(editionSummaryListQueryOptions);
	// One query, not two: the summaries carry everything selectFestivalMode needs,
	// and it is generic so the counts survive the round trip
	const { archive } = selectFestivalMode(editions, Date.now());

	return (
		<main className="page-wrap flex-1 py-16 sm:py-20">
			<p className="m-0 text-xs font-semibold tracking-[0.25em] text-glow uppercase">
				{m.archive_kicker()}
			</p>
			<h1 className="mt-2 mb-0 font-display text-4xl text-moon sm:text-5xl">
				{m.archive_title()}
			</h1>
			<p className="mt-4 mb-0 max-w-2xl text-moon-dim">{m.archive_text()}</p>

			{archive.length === 0 ? (
				<p className="mt-10 inline-block badge">{m.archive_empty()}</p>
			) : (
				<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{archive.map((edition) => (
						<YearCard key={edition.year} edition={edition} />
					))}
				</div>
			)}
		</main>
	);
}

function YearCard({ edition }: { edition: EditionSummary }) {
	// Which sections are actually behind the card, so nobody clicks into an
	// aftermovie-only year expecting a lineup — which is every year before 2026.
	// Section names rather than counts: "1 Acts" would need plural variants in two
	// languages, and what the page contains is the more useful thing to know.
	const holdings = [
		edition.artistCount > 0 ? m.archive_lineup_title() : null,
		edition.workshopCount > 0 ? m.archive_workshops_title() : null,
		edition.memoryCount > 0 ? m.archive_memories_title() : null,
		edition.aftermovieYoutubeId ? m.archive_aftermovie_title() : null,
	].filter(Boolean);

	return (
		<Link
			to="/archiv/$year"
			params={{ year: String(edition.year) }}
			className="group block overflow-hidden rounded-xs border border-border bg-night-soft/50 no-underline transition-colors hover:border-glow/50"
		>
			{edition.aftermoviePoster ? (
				<img
					src={sanityCropUrl(edition.aftermoviePoster, 640, 360)}
					alt=""
					loading="lazy"
					className="aspect-video w-full object-cover opacity-70 transition-opacity group-hover:opacity-90"
				/>
			) : (
				// The year set large is a better placeholder than a grey box: it is what
				// the card is about
				<div className="flex aspect-video w-full items-center justify-center bg-night-mist/40 font-display text-6xl text-moon-dim/40">
					{edition.year}
				</div>
			)}
			<div className="p-5">
				<h2 className="m-0 font-display text-2xl text-moon">
					Grundstock {edition.year}
				</h2>
				<p className="mt-1 mb-0 text-sm text-glow-soft">
					{dateRangeLabel(edition)}
				</p>
				<p className="mt-2 mb-0 text-sm text-moon-dim">
					{holdings.length > 0 ? holdings.join(" · ") : m.archive_year_sparse()}
				</p>
			</div>
		</Link>
	);
}
