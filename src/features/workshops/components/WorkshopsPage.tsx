import { useSuspenseQuery } from "@tanstack/react-query";
import type { FestivalDay } from "#/features/lineup/types";
import { localized } from "#/lib/sanity";
import { m } from "#/paraglide/messages";
import { workshopListQueryOptions } from "../api/workshops";

const DAY_LABELS: Record<FestivalDay, () => string> = {
	do: m.day_do,
	fr: m.day_fr,
	sa: m.day_sa,
};

export function WorkshopsPage() {
	const { data: workshops } = useSuspenseQuery(workshopListQueryOptions);

	return (
		<main className="page-wrap flex-1 py-16 sm:py-20">
			<p className="m-0 text-xs font-semibold tracking-[0.25em] text-glow uppercase">
				{m.workshops_kicker()}
			</p>
			<h1 className="mt-2 mb-0 font-display text-4xl text-moon sm:text-5xl">
				{m.workshops_title()}
			</h1>
			<p className="mt-4 mb-0 max-w-2xl text-moon-dim">{m.workshops_text()}</p>

			{workshops.length === 0 ? (
				<p className="mt-10 inline-block badge">{m.workshops_soon()}</p>
			) : (
				<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{workshops.map((workshop) => (
						<article
							key={workshop.slug}
							className="inner-edge rounded-xs border border-border bg-night-soft/50 p-5"
						>
							<h2 className="m-0 font-display text-lg text-moon">
								{workshop.title}
							</h2>
							<p className="mt-1 mb-0 text-sm text-glow-soft">
								{[
									workshop.day ? DAY_LABELS[workshop.day]() : null,
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
					))}
				</div>
			)}
		</main>
	);
}
