import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { pickArchiveYear } from "#/features/archive/lib/loadArchivedEdition";
import { loadFestivalMode } from "#/features/festival/hooks/useFestival";
import {
	artistDetailQueryOptions,
	artistEditionYearsQueryOptions,
} from "#/features/lineup/api/artists";
import { ArtistDetailPage } from "#/features/lineup/components/ArtistDetailPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/artists/$slug")({
	loader: async ({ context, params }) => {
		const { featured, archive } = await loadFestivalMode(context.queryClient);
		const artist = featured
			? await context.queryClient.ensureQueryData(
					artistDetailQueryOptions(featured.year, params.slug),
				)
			: null;

		// Not in the edition on display: this is almost certainly a link shared
		// while an earlier festival was on. Find the year it belongs to and send it
		// there rather than 404ing — those links keep getting clicked for years.
		if (!artist) {
			const years = await context.queryClient.ensureQueryData(
				artistEditionYearsQueryOptions(params.slug),
			);
			const archived = pickArchiveYear(years, archive);
			if (archived === null) throw notFound();
			throw redirect({
				to: "/archiv/$year/artists/$slug",
				params: { year: String(archived), slug: params.slug },
			});
		}

		// featured is non-null whenever artist is
		return {
			edition: featured as NonNullable<typeof featured>,
			name: artist.name,
		};
	},
	head: ({ loaderData, params }) =>
		seo({
			title: loaderData
				? m.page_title({
						page: loaderData.name,
						year: loaderData.edition.year,
					})
				: "Artist",
			description: loaderData
				? m.artist_meta_description({
						name: loaderData.name,
						year: loaderData.edition.year,
					})
				: undefined,
			path: `/artists/${params.slug}`,
		}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: RouteComponent,
});

function RouteComponent() {
	const { slug } = Route.useParams();
	const { edition } = Route.useLoaderData();
	return <ArtistDetailPage edition={edition} slug={slug} />;
}
