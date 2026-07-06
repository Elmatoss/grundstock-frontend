import { createFileRoute } from "@tanstack/react-router";
import { PageError, PagePending } from "#/components/RouteStates";
import { faqListQueryOptions } from "#/features/infos/api/faq";
import { InfosPage } from "#/features/infos/components/InfosPage";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/infos")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(faqListQueryOptions),
	head: () => ({
		meta: [
			{ title: `${m.infos_title()} — Grundstock Festival 2026` },
			{ name: "description", content: m.infos_intro() },
		],
		links: [{ rel: "canonical", href: `${site.baseUrl}/infos` }],
	}),
	errorComponent: PageError,
	pendingComponent: PagePending,
	component: InfosPage,
});
