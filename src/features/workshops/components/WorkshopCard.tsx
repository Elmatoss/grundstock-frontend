import { localized } from "#/lib/sanity";
import { m } from "#/paraglide/messages";
import type { Workshop } from "../types";

/**
 * One workshop. Shared by /workshops and the archive's year pages.
 *
 * `dayLabel` is passed in rather than derived here: the day is stored as an
 * offset, and only the caller knows which edition to resolve it against.
 *
 * The heading level is the caller's too: on /workshops these sit directly under
 * the page's h1, on an archive year page they sit under a section h2. Hardcoding
 * one of the two would skip a level on the other.
 */
export function WorkshopCard({
	workshop,
	dayLabel,
	headingLevel: Heading = "h3",
}: {
	workshop: Workshop;
	dayLabel: string | null;
	headingLevel?: "h2" | "h3";
}) {
	return (
		<article className="inner-edge rounded-xs border border-border bg-night-soft/50 p-5">
			<Heading className="m-0 font-display text-lg text-moon">
				{workshop.title}
			</Heading>
			<p className="mt-1 mb-0 text-sm text-glow-soft">
				{[
					dayLabel,
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
}
