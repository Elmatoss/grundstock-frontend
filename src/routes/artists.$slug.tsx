import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { artistDetailQueryOptions } from "#/features/lineup/api/artists";
import { ArtistDetailPage } from "#/features/lineup/components/ArtistDetailPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/artists/$slug")({
	loader: async ({ context, params }) => {
		const artist = await context.queryClient.ensureQueryData(
			artistDetailQueryOptions(params.slug),
		);
		if (!artist) throw notFound();
		return { name: artist.name };
	},
	head: ({ loaderData, params }) =>
		seo({
			title: `${loaderData?.name ?? "Artist"} — Grundstock Festival 2026`,
			description: loaderData
				? m.artist_meta_description({ name: loaderData.name })
				: undefined,
			path: `/artists/${params.slug}`,
		}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: RouteComponent,
});

function RouteComponent() {
	const { slug } = Route.useParams();
	return <ArtistDetailPage slug={slug} />;
}
