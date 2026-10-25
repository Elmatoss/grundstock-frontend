import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { loadArchivedEdition } from "#/features/archive/lib/loadArchivedEdition";
import { artistDetailQueryOptions } from "#/features/lineup/api/artists";
import { ArtistDetailPage } from "#/features/lineup/components/ArtistDetailPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/archiv/$year/artists/$slug")({
	loader: async ({ context, params }) => {
		const { edition, isFeatured } = await loadArchivedEdition(
			context.queryClient,
			params.year,
		);
		const artist = await context.queryClient.ensureQueryData(
			artistDetailQueryOptions(edition.year, params.slug),
		);
		if (!artist) throw notFound();
		return { edition, isFeatured, name: artist.name };
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
			path: `/archiv/${params.year}/artists/${params.slug}`,
			// see archiv.$year.index: a duplicate of /artists/<slug> until a new
			// edition takes over the main pages
			noindex: loaderData?.isFeatured,
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
