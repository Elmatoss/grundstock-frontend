import { createFileRoute } from "@tanstack/react-router";
import { peekFestivalMode } from "#/features/festival/hooks/useFestival";
import { VereinPage } from "#/features/verein/components/VereinPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/verein")({
	// The year is only for the document title, so peek rather than ensure — this
	// page is static copy and must never fail on the CMS
	loader: async ({ context }) => {
		const { featured } = await peekFestivalMode(context.queryClient);
		return { year: featured?.year ?? null };
	},
	head: ({ loaderData }) =>
		seo({
			title: loaderData?.year
				? m.page_title({ page: m.nav_verein(), year: loaderData.year })
				: m.nav_verein(),
			description: m.verein_intro(),
			path: "/verein",
		}),
	component: VereinPage,
});
