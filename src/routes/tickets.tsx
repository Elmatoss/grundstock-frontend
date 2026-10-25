import { createFileRoute, redirect } from "@tanstack/react-router";
import { site } from "#/lib/site";

// Stable short URL for print/QR/socials — target changes without breaking links.
// Without a shop it lands on the homepage's tickets section, which says so.
export const Route = createFileRoute("/tickets")({
	beforeLoad: () => {
		if (site.ticketUrl) throw redirect({ href: site.ticketUrl });
		throw redirect({ to: "/", hash: "tickets" });
	},
});
