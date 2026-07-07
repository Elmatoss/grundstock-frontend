import { createFileRoute } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { faqListQueryOptions } from "#/features/infos/api/faq";
import { InfosPage } from "#/features/infos/components/InfosPage";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/infos")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(faqListQueryOptions),
	head: () =>
		seo({
			title: `${m.infos_title()} — Grundstock Festival 2026`,
			description: m.infos_intro(),
			path: "/infos",
		}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: InfosPage,
});
