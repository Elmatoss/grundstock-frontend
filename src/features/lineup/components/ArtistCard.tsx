import { Link } from "@tanstack/react-router";
import { localized, sanityImageProps } from "#/lib/sanity";
import type { ArtistCard as ArtistCardData } from "../types";

// Up to two initials — a typographic placeholder that belongs to the artist,
// unlike the generic ✦ it replaces
function initials(name: string) {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase();
}

export function ArtistCard({ artist }: { artist: ArtistCardData }) {
	return (
		<Link
			to="/artists/$slug"
			params={{ slug: artist.slug }}
			className="group block overflow-hidden rounded-xs border border-border bg-night-soft/50 no-underline transition-colors hover:border-glow/50"
		>
			{artist.image ? (
				<img
					{...sanityImageProps(artist.image, 480, 640)}
					sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 90vw"
					alt={artist.image.alt ?? artist.name}
					loading="lazy"
					className="aspect-3/4 w-full object-cover"
				/>
			) : (
				<div className="flex aspect-3/4 w-full items-center justify-center bg-night-mist/40 font-display text-5xl tracking-widest text-moon-dim/45">
					{initials(artist.name)}
				</div>
			)}
			<div className="p-4">
				<h3 className="m-0 font-display text-xl text-moon">{artist.name}</h3>
				{artist.genres && artist.genres.length > 0 && (
					<p className="mt-1 mb-0 text-sm text-glow-soft">
						{artist.genres.join(", ")}
					</p>
				)}
				{artist.shortBlurb && (
					<p className="mt-2 mb-0 text-sm text-moon-dim">
						{localized(artist.shortBlurb)}
					</p>
				)}
			</div>
		</Link>
	);
}
