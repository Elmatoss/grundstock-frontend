import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { editionListQueryOptions } from "#/features/festival/api/editions";
import { latestAftermovie } from "#/features/festival/lib/festival";
import { sanityCropUrl } from "#/lib/sanity";
import { m } from "#/paraglide/messages";
import { Section } from "./Section";

/**
 * The most recent aftermovie there is.
 *
 * Used to be a hardcoded YouTube id for 2025. It now follows the CMS, so the year
 * after a festival the new aftermovie simply appears here — and the poster comes
 * from the edition too, falling back to the static image for the years that have
 * none.
 */
function RecapVideo({ year, videoId, poster }: RecapProps) {
	const [playing, setPlaying] = useState(false);

	if (playing) {
		return (
			<iframe
				src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
				title={m.recap_title({ year })}
				allow="autoplay; encrypted-media; fullscreen"
				allowFullScreen
				className="aspect-video w-full rounded-xs border border-border"
			/>
		);
	}

	return (
		<button
			type="button"
			onClick={() => setPlaying(true)}
			className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-xs border border-border p-0 text-left"
		>
			<img
				src={poster ?? "/recap-poster.jpg"}
				alt={m.recap_title({ year })}
				loading="lazy"
				className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-80"
			/>
			<span className="absolute inset-0 flex items-center justify-center">
				{/* Bare amber triangle — no plate, no circle, no border */}
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					className="h-14 w-14 text-glow drop-shadow-[0_0_24px_rgba(240,169,60,0.45)] transition-transform duration-300 group-hover:scale-110"
					fill="currentColor"
				>
					<path d="M8 5v14l11-7z" />
				</svg>
				<span className="sr-only">{m.recap_play()}</span>
			</span>
			<span className="absolute right-0 bottom-0 left-0 bg-night/80 px-4 py-2 text-xs text-moon-dim">
				{m.recap_consent()}
			</span>
		</button>
	);
}

type RecapProps = { year: number; videoId: string; poster: string | null };

export function StorySection() {
	// useQuery, not the suspense variant: the story is copy and must render even
	// if the editions never arrive — then there is simply no video beside it
	const { data: editions } = useQuery(editionListQueryOptions);
	const recap = editions ? latestAftermovie(editions) : null;
	const videoId = recap?.aftermovieYoutubeId;

	return (
		<Section kicker={m.story_kicker()} title={m.story_title()}>
			<div className="grid items-start gap-8 lg:grid-cols-2">
				<p className="m-0 max-w-2xl text-lg leading-relaxed text-moon-dim">
					{m.story_text()}
				</p>
				{recap && videoId && (
					<div>
						<h3 className="mt-0 mb-3 font-display text-xl text-moon">
							{m.recap_title({ year: recap.year })}
						</h3>
						<RecapVideo
							year={recap.year}
							videoId={videoId}
							poster={
								recap.aftermoviePoster
									? sanityCropUrl(recap.aftermoviePoster, 960, 540)
									: null
							}
						/>
					</div>
				)}
			</div>
		</Section>
	);
}
