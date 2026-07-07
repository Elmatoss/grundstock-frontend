import { Link } from "@tanstack/react-router";
import { localized, sanityCropUrl } from "#/lib/sanity";
import type { ArtistCard as ArtistCardData } from "../types";

export function ArtistCard({ artist }: { artist: ArtistCardData }) {
	return (
		<Link
			to="/artists/$slug"
			params={{ slug: artist.slug }}
			className="group block overflow-hidden rounded-xl border border-border bg-night-soft/50 no-underline transition-colors hover:border-glow/50"
		>
			{artist.image ? (
				<img
					src={sanityCropUrl(artist.image, 640, 480)}
					alt={artist.image.alt ?? artist.name}
					loading="lazy"
					className="aspect-4/3 w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
				/>
			) : (
				<div className="flex aspect-4/3 w-full items-center justify-center bg-night-mist/40 font-display text-4xl text-moon-dim/50">
					✦
				</div>
			)}
			<div className="p-4">
				<h3 className="m-0 font-display text-lg font-bold text-moon">
					{artist.name}
				</h3>
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
