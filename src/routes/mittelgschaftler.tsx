import { createFileRoute, redirect } from "@tanstack/react-router";

// Stable short URL for print/QR/socials — target changes without breaking links
export const Route = createFileRoute("/mittelgschaftler")({
	beforeLoad: () => {
		throw redirect({ to: "/", hash: "helfen" });
	},
});
