import { useQuery } from "@tanstack/react-query";
import { featuredArtistsQueryOptions } from "../api/artists";
import { ArtistCard } from "./ArtistCard";

// Renders nothing until featured artists exist in the CMS — the homepage
// must never depend on Sanity being up
export function FeaturedArtists() {
	const { data: artists } = useQuery(featuredArtistsQueryOptions);
	if (!artists || artists.length === 0) return null;

	return (
		<div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
			{artists.map((artist) => (
				<div key={artist.slug} className="w-64 flex-none snap-start sm:w-72">
					<ArtistCard artist={artist} />
				</div>
			))}
		</div>
	);
}
