import { useQuery } from "@tanstack/react-query";
import { VideoEmbed } from "#/components/VideoEmbed";
import { editionListQueryOptions } from "#/features/festival/api/editions";
import { latestAftermovie } from "#/features/festival/lib/festival";
import { sanityCropUrl } from "#/lib/sanity";
import { m } from "#/paraglide/messages";
import { Section } from "./Section";

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
						<VideoEmbed
							youtubeId={videoId}
							title={m.recap_title({ year: recap.year })}
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
