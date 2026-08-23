import { useSuspenseQuery } from "@tanstack/react-query";
import { useFestival } from "#/features/festival/hooks/useFestival";
import { programmeDate } from "#/features/festival/lib/festival";
import type { Edition } from "#/features/festival/types";
import { dayLabel } from "#/features/timetable/lib/format";
import { localized } from "#/lib/sanity";
import { m } from "#/paraglide/messages";
import { workshopListQueryOptions } from "../api/workshops";

export function WorkshopsPage() {
	const { featured } = useFestival();

	return (
		<main className="page-wrap flex-1 py-16 sm:py-20">
			<p className="m-0 text-xs font-semibold tracking-[0.25em] text-glow uppercase">
				{m.workshops_kicker()}
			</p>
			<h1 className="mt-2 mb-0 font-display text-4xl text-moon sm:text-5xl">
				{m.workshops_title()}
			</h1>
			<p className="mt-4 mb-0 max-w-2xl text-moon-dim">{m.workshops_text()}</p>

			{featured ? (
				<Workshops edition={featured} />
			) : (
				<p className="mt-10 inline-block badge">{m.festival_tba_text()}</p>
			)}
		</main>
	);
}

function Workshops({ edition }: { edition: Edition }) {
	const { data: workshops } = useSuspenseQuery(
		workshopListQueryOptions(edition.year),
	);

	if (workshops.length === 0) {
		return <p className="mt-10 inline-block badge">{m.workshops_soon()}</p>;
	}

	return (
		<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{workshops.map((workshop) => {
				// A workshop may sit on a day the edition does not have — an editor
				// typo, or a shortened festival. Better unlabelled than mislabelled.
				const date = workshop.dayIndex
					? programmeDate(edition, workshop.dayIndex)
					: null;
				return (
					<article
						key={workshop.slug}
						className="inner-edge rounded-xs border border-border bg-night-soft/50 p-5"
					>
						<h2 className="m-0 font-display text-lg text-moon">
							{workshop.title}
						</h2>
						<p className="mt-1 mb-0 text-sm text-glow-soft">
							{[
								date ? dayLabel(date) : null,
								// no end time is published — workshops run until they run out
								workshop.start
									? m.timetable_open_start({ time: workshop.start })
									: null,
							]
								.filter(Boolean)
								.join(" · ")}
						</p>
						{workshop.description && (
							<p className="mt-3 mb-0 text-sm text-moon-dim">
								{localized(workshop.description)}
							</p>
						)}
					</article>
				);
			})}
		</div>
	);
}
