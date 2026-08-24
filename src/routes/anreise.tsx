import { createFileRoute } from "@tanstack/react-router";
import { peekFestivalMode } from "#/features/festival/hooks/useFestival";
import { AnreisePage } from "#/features/location/components/AnreisePage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/anreise")({
	// The year is only for the document title, so peek rather than ensure — this
	// page is static copy and must never fail on the CMS
	loader: async ({ context }) => {
		const { featured } = await peekFestivalMode(context.queryClient);
		return { year: featured?.year ?? null };
	},
	head: ({ loaderData }) =>
		seo({
			title: loaderData?.year
				? m.page_title({ page: m.nav_anreise(), year: loaderData.year })
				: m.nav_anreise(),
			description: m.anreise_intro(),
			path: "/anreise",
		}),
	component: AnreisePage,
});
