import { useState } from "react";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";
import { Section } from "./Section";

function RecapVideo() {
	const [playing, setPlaying] = useState(false);

	if (playing) {
		return (
			<iframe
				src={`https://www.youtube-nocookie.com/embed/${site.recapYoutubeId}?autoplay=1`}
				title={m.recap_title()}
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
				src="/recap-poster.jpg"
				alt={m.recap_title()}
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

export function StorySection() {
	return (
		<Section kicker={m.story_kicker()} title={m.story_title()}>
			<div className="grid items-start gap-8 lg:grid-cols-2">
				<p className="m-0 max-w-2xl text-lg leading-relaxed text-moon-dim">
					{m.story_text()}
				</p>
				<div>
					<h3 className="mt-0 mb-3 font-display text-xl text-moon">
						{m.recap_title()}
					</h3>
					<RecapVideo />
				</div>
			</div>
		</Section>
	);
}
