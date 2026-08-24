import { createFileRoute } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { peekFestivalMode } from "#/features/festival/hooks/useFestival";
import { faqListQueryOptions } from "#/features/infos/api/faq";
import { InfosPage } from "#/features/infos/components/InfosPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/infos")({
	// The year is only for the document title, so peek rather than ensure: a page
	// of FAQ answers must not fail because the editions could not be fetched
	loader: async ({ context }) => {
		const [, { featured }] = await Promise.all([
			context.queryClient.ensureQueryData(faqListQueryOptions),
			peekFestivalMode(context.queryClient),
		]);
		return { year: featured?.year ?? null };
	},
	head: ({ loaderData }) =>
		seo({
			title: loaderData?.year
				? m.page_title({ page: m.infos_title(), year: loaderData.year })
				: m.infos_title(),
			description: m.infos_intro(),
			path: "/infos",
		}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: InfosPage,
});
