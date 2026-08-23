import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { loadFestivalMode } from "#/features/festival/hooks/useFestival";
import { artistDetailQueryOptions } from "#/features/lineup/api/artists";
import { ArtistDetailPage } from "#/features/lineup/components/ArtistDetailPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/artists/$slug")({
	loader: async ({ context, params }) => {
		const { featured } = await loadFestivalMode(context.queryClient);
		// No edition on display means no artist pages to serve
		if (!featured) throw notFound();
		const artist = await context.queryClient.ensureQueryData(
			artistDetailQueryOptions(featured.year, params.slug),
		);
		if (!artist) throw notFound();
		return { edition: featured, name: artist.name };
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
