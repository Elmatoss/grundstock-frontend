import { createFileRoute, redirect } from "@tanstack/react-router";
import { site } from "#/lib/site";

// Stable short URL for print/QR/socials — target changes without breaking links.
// Without a shift tool it lands on the homepage's helfen section, which says so.
export const Route = createFileRoute("/helfen")({
	beforeLoad: () => {
		if (site.helfertoolUrl) throw redirect({ href: site.helfertoolUrl });
		throw redirect({ to: "/", hash: "helfen" });
	},
});
