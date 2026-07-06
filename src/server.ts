import handler from "@tanstack/react-start/server-entry";
import { paraglideMiddleware } from "#/paraglide/server";

// CSP is deliberately absent for now: TanStack Start injects inline hydration
// scripts that need nonce/hash support — revisit with docs/PLAN.md §8
const SECURITY_HEADERS: Record<string, string> = {
	"Strict-Transport-Security": "max-age=31536000; includeSubDomains",
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
	"X-Frame-Options": "DENY",
};

export default {
	async fetch(request: Request) {
		// Scopes the request's locale via AsyncLocalStorage so getLocale()/m.*()
		// resolve correctly during SSR. The handler must receive the ORIGINAL
		// (still localized) URL — the router's rewrite.input de-localizes it;
		// passing the middleware's de-localized request makes the router see a
		// URL mismatch and 307-loop.
		const response = await paraglideMiddleware(request, () =>
			handler.fetch(request),
		);
		const headers = new Headers(response.headers);
		for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
			headers.set(key, value);
		}
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	},
};
