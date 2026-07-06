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

export function HomePage() {
	return (
		<main>
			<Hero />
			<IntroSection />
			<GenreMarquee />
			<LineupTeaser />
			<WorkshopsTeaser />
			<InclusiveSection />
			<HelfenSection />
			<LocationSection />
			<StorySection />
			<TicketsCta />
			<FaqSection />
		</main>
	);
}
