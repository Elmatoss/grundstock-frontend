import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { artistDetailQueryOptions } from "#/features/lineup/api/artists";
import { ArtistDetailPage } from "#/features/lineup/components/ArtistDetailPage";
import { site } from "#/lib/site";

export const Route = createFileRoute("/artists/$slug")({
	loader: async ({ context, params }) => {
		const artist = await context.queryClient.ensureQueryData(
			artistDetailQueryOptions(params.slug),
		);
		if (!artist) throw notFound();
		return { name: artist.name };
	},
	head: ({ loaderData, params }) => ({
		meta: [
			{
				title: `${loaderData?.name ?? "Artist"} — Grundstock Festival 2026`,
			},
		],
		links: [
			{ rel: "canonical", href: `${site.baseUrl}/artists/${params.slug}` },
		],
	}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: RouteComponent,
});

function RouteComponent() {
	const { slug } = Route.useParams();
	return <ArtistDetailPage slug={slug} />;
}
