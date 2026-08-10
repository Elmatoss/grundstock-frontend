import { PortableText } from "@portabletext/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { localized, localizedBlock, sanityImageProps } from "#/lib/sanity";
import { m } from "#/paraglide/messages";
import { artistDetailQueryOptions } from "../api/artists";
import type { FestivalDay } from "../types";

const DAY_LABELS: Record<FestivalDay, () => string> = {
	do: m.day_do,
	fr: m.day_fr,
	sa: m.day_sa,
};

export function ArtistDetailPage({ slug }: { slug: string }) {
	const { data: artist } = useSuspenseQuery(artistDetailQueryOptions(slug));
	// The loader already 404s on null; this narrows the type for TS
	if (!artist) return null;

	const bioBlocks = localizedBlock(artist.bio);

	return (
		<main className="page-wrap flex-1 py-16 sm:py-20">
			<Link
				to="/lineup"
				className="text-sm font-semibold text-moon-dim no-underline hover:text-moon"
			>
				← {m.artist_back()}
			</Link>
			<div className="mt-6 grid items-start gap-8 lg:grid-cols-2">
				<div>
					<h1 className="m-0 font-display text-4xl text-moon sm:text-5xl">
						{artist.name}
					</h1>
					{artist.genres && artist.genres.length > 0 && (
						<p className="mt-2 mb-0 text-glow-soft">
							{artist.genres.join(" · ")}
						</p>
					)}
					{artist.performances && artist.performances.length > 0 && (
						<ul className="m-0 mt-4 list-none space-y-1 p-0 text-moon-dim">
							{artist.performances.map((p, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: performances have no id and an act can play the same stage twice
								<li key={`${p.day}-${p.stage?.slug}-${index}`}>
									{DAY_LABELS[p.day]()}
									{p.stage ? ` · ${p.stage.name}` : ""}
									{/* wall-clock strings straight from the CMS — festival time,
									    not the viewer's */}
									{p.start ? ` · ${p.start}` : ""}
									{p.start && p.end ? `–${p.end} Uhr` : ""}
								</li>
							))}
						</ul>
					)}
					{artist.shortBlurb && (
						<p className="mt-4 mb-0 text-lg text-moon-dim">
							{localized(artist.shortBlurb)}
						</p>
					)}
					{bioBlocks && bioBlocks.length > 0 && (
						<div className="prose prose-invert mt-6 prose-p:text-moon-dim">
							{/* biome-ignore lint/suspicious/noExplicitAny: portable text blocks are validated loosely by design */}
							<PortableText value={bioBlocks as any} />
						</div>
					)}
					{artist.links && artist.links.length > 0 && (
						<div className="mt-6 flex flex-wrap gap-3">
							{artist.links.map((link) => (
								<a
									key={link._key ?? link.url}
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									className="btn btn-secondary btn-sm no-underline"
								>
									{link.title}
								</a>
							))}
						</div>
					)}
				</div>
				{artist.image && (
					<img
						{...sanityImageProps(artist.image, 720, 960)}
						sizes="(min-width: 1024px) 520px, 92vw"
						alt={artist.image.alt ?? artist.name}
						className="h-auto w-full rounded-xs border border-border object-cover"
					/>
				)}
			</div>
		</main>
	);
}
