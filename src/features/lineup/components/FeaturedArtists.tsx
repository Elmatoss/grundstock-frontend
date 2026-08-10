import { useQuery } from "@tanstack/react-query";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useMemo, useState } from "react";
import { pickRandom } from "#/lib/random";
import { m } from "#/paraglide/messages";
import { artistListQueryOptions } from "../api/artists";
import type { ArtistCard as ArtistCardData } from "../types";
import { ArtistCard } from "./ArtistCard";

/** How many acts the teaser shows out of the whole lineup. */
const TEASER_COUNT = 10;

// Embla only loops once the slides overflow the viewport. With a handful of
// artists that isn't guaranteed on wide screens, so we repeat the list until the
// belt is long enough to drift seamlessly.
function fillForLoop(artists: ArtistCardData[], min: number) {
	if (artists.length === 0) return artists;
	const copies = Math.ceil(min / artists.length);
	return Array.from({ length: copies }, () => artists).flat();
}

// A slow, self-rotating marquee: it drifts on its own, pauses on hover and while
// you drag, and can be flung by hand with momentum. Renders nothing until artists
// exist — the homepage never depends on Sanity being reachable.
//
// The ten acts are drawn from the whole lineup by `seed`, which the route loader
// rolls once per page load and the SSR payload carries to the client. The draw
// cannot happen here from Math.random(): the server and hydration would disagree
// and React would swap the whole belt out from under the visitor.
export function FeaturedArtists({ seed }: { seed: number }) {
	const { data: allArtists } = useQuery(artistListQueryOptions);
	const artists = useMemo(
		() => (allArtists ? pickRandom(allArtists, TEASER_COUNT, seed) : undefined),
		[allArtists, seed],
	);

	// Read the preference on mount (SSR has no matchMedia) and keep it in sync;
	// reduced motion drops the auto-drift but keeps the carousel draggable.
	const [reduceMotion, setReduceMotion] = useState(
		() =>
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches,
	);
	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setReduceMotion(query.matches);
		query.addEventListener("change", sync);
		return () => query.removeEventListener("change", sync);
	}, []);

	const [emblaRef] = useEmblaCarousel(
		{ loop: true, dragFree: true, align: "start" },
		reduceMotion
			? []
			: [
					AutoScroll({
						speed: 0.8,
						startDelay: 0,
						stopOnInteraction: false,
						stopOnMouseEnter: true,
					}),
				],
	);

	if (!artists || artists.length === 0) return null;

	const slides = fillForLoop(artists, 12);

	return (
		// biome-ignore lint/a11y/useSemanticElements: a labelled scroll region, not a <section>
		<div
			ref={emblaRef}
			role="region"
			aria-label={m.lineup_featured_label()}
			className="-mx-4 mt-8 cursor-grab overflow-hidden px-4 pb-4 select-none active:cursor-grabbing mask-[linear-gradient(to_right,transparent,#000_2.5rem,#000_calc(100%-2.5rem),transparent)]"
		>
			<div className="flex">
				{slides.map((artist, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: slides intentionally repeat the same artists to fill the loop, so the slug isn't unique — position is the stable identity and the list never reorders
						key={`${artist.slug}-${index}`}
						aria-hidden={index >= artists.length}
						className="w-64 flex-none pr-4 sm:w-72"
					>
						<ArtistCard artist={artist} />
					</div>
				))}
			</div>
		</div>
	);
}
