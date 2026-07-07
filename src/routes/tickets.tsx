import { createFileRoute, redirect } from "@tanstack/react-router";
import { site } from "#/lib/site";

// Stable short URL for print/QR/socials — target changes without breaking links
export const Route = createFileRoute("/tickets")({
	beforeLoad: () => {
		throw redirect({ href: site.ticketUrl });
	},
});
