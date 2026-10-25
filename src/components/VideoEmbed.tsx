import { useState } from "react";
import { m } from "#/paraglide/messages";

/**
 * A click-to-load YouTube embed.
 *
 * Nothing reaches Google until the visitor presses play: the poster is our own
 * image, the iframe is only mounted after the click, and the notice under it says
 * so. That is the whole reason this is a button rather than an iframe with a
 * cookie banner bolted on.
 *
 * Extracted from the homepage's recap block, which is now one of three callers —
 * the archive's aftermovies and the memory clips embed the same way.
 */
export function VideoEmbed({
	youtubeId,
	title,
	poster,
}: {
	youtubeId: string;
	title: string;
	/** Falls back to the static 2025 recap still when an edition has none */
	poster?: string | null;
}) {
	const [playing, setPlaying] = useState(false);

	if (playing) {
		return (
			<iframe
				src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
				title={title}
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
				alt={title}
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
