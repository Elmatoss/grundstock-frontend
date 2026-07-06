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
				className="aspect-video w-full rounded-xl border border-border"
			/>
		);
	}

	return (
		<button
			type="button"
			onClick={() => setPlaying(true)}
			className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-xl border border-border p-0 text-left"
		>
			<img
				src="/recap-poster.jpg"
				alt={m.recap_title()}
				loading="lazy"
				className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-80"
			/>
			<span className="absolute inset-0 flex items-center justify-center">
				<span className="flex h-16 w-16 items-center justify-center rounded-full bg-glow text-2xl text-night shadow-[0_0_32px_rgba(255,181,36,0.5)] transition-transform group-hover:scale-110">
					▶
				</span>
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
					<h3 className="mt-0 mb-3 font-display text-xl font-bold text-moon">
						{m.recap_title()}
					</h3>
					<RecapVideo />
				</div>
			</div>
		</Section>
	);
}
