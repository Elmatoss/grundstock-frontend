import { useSuspenseQuery } from "@tanstack/react-query";
import type { FestivalDay } from "#/features/lineup/types";
import { localized, sanityImageProps } from "#/lib/sanity";
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
			<p className="m-0 font-display text-sm font-semibold tracking-[0.2em] text-glow uppercase">
				{m.workshops_kicker()}
			</p>
			<h1 className="mt-2 mb-0 font-display text-4xl font-bold text-moon sm:text-5xl">
				{m.workshops_title()}
			</h1>
			<p className="mt-4 mb-0 max-w-2xl text-moon-dim">{m.workshops_text()}</p>

			{workshops.length === 0 ? (
				<p className="mt-10 inline-block rounded-full border border-glow/40 bg-glow/10 px-4 py-2 font-display text-sm font-semibold text-glow-soft">
					{m.workshops_soon()}
				</p>
			) : (
				<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{workshops.map((workshop) => (
						<article
							key={workshop.slug}
							className="overflow-hidden rounded-xl border border-border bg-night-soft/50"
						>
							{workshop.image && (
								<img
									{...sanityImageProps(workshop.image, 480, 270)}
									sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 90vw"
									alt={workshop.image.alt ?? workshop.title}
									loading="lazy"
									className="aspect-video w-full object-cover opacity-80"
								/>
							)}
							<div className="p-5">
								<h2 className="m-0 font-display text-lg font-bold text-moon">
									{workshop.title}
								</h2>
								<p className="mt-1 mb-0 text-sm text-glow-soft">
									{[
										workshop.day ? DAY_LABELS[workshop.day]() : null,
										workshop.time,
										workshop.location,
									]
										.filter(Boolean)
										.join(" · ")}
								</p>
								{workshop.host && (
									<p className="mt-1 mb-0 text-sm text-moon-dim">
										{workshop.host}
									</p>
								)}
								{workshop.description && (
									<p className="mt-3 mb-0 text-sm text-moon-dim">
										{localized(workshop.description)}
									</p>
								)}
							</div>
						</article>
					))}
				</div>
			)}
		</main>
	);
}
