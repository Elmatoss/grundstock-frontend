import { createFileRoute } from "@tanstack/react-router";
import { FestivalPolicyPage } from "#/features/legal/FestivalPolicy";
import { seo } from "#/lib/seo";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/festival-policy")({
	head: () =>
		seo({
			title: `${m.legal_policy_title()} — Grundstock Festival`,
			path: "/festival-policy",
		}),
	component: FestivalPolicyPage,
});
