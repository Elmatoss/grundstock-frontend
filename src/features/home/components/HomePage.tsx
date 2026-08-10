import { getRouteApi } from "@tanstack/react-router";
import { parsePreviewInstant } from "#/features/timetable/lib/schedule";
import { AwarenessSection } from "./AwarenessSection";
import { FaqSection } from "./FaqSection";
import { GenreMarquee } from "./GenreMarquee";
import { HelfenSection } from "./HelfenSection";
import { Hero } from "./Hero";
import { InclusiveSection } from "./InclusiveSection";
import { IntroSection } from "./IntroSection";
import { LineupTeaser } from "./LineupTeaser";
import { LocationSection } from "./LocationSection";
import { StorySection } from "./StorySection";
import { TicketsCta } from "./TicketsCta";
import { WorkshopsTeaser } from "./WorkshopsTeaser";

// getRouteApi rather than importing the route, which already imports this
const route = getRouteApi("/");

export function HomePage() {
	// `/?t=2026-08-14T22:45` pins the hero's clock, so the countdown → live
	// programme swap can be reviewed before the festival actually starts
	const { t } = route.useSearch();
	// Rolled server-side once per page load and carried over in the SSR payload, so
	// the teaser's random ten are the same ten the client hydrates with
	const { teaserSeed } = route.useLoaderData();

	return (
		<main>
			<Hero previewNow={parsePreviewInstant(t)} />
			<IntroSection />
			<GenreMarquee />
			<LineupTeaser teaserSeed={teaserSeed} />
			<WorkshopsTeaser />
			<InclusiveSection />
			<HelfenSection />
			<LocationSection />
			<StorySection />
			<AwarenessSection />
			<TicketsCta />
			<FaqSection />
		</main>
	);
}
