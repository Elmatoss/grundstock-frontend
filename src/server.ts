import handler from "@tanstack/react-start/server-entry";
import { localeRedirect } from "#/lib/locale-negotiation";
import { site } from "#/lib/site";
import { paraglideMiddleware } from "#/paraglide/server";

const CANONICAL_HOST = new URL(site.baseUrl).hostname;

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
		const url = new URL(request.url);
		if (url.hostname === `www.${CANONICAL_HOST}`) {
			url.hostname = CANONICAL_HOST;
			return Response.redirect(url.toString(), 301);
		}

		const redirect = localeRedirect(request, url);
		if (redirect) return redirect;

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
		// The same German URL answers 200 (German) or 302 → /en depending on
		// these headers (localeRedirect above) — caches must key on them
		if (headers.get("content-type")?.includes("text/html")) {
			headers.append("Vary", "Accept-Language, Cookie");
		}
		// Keep *.workers.dev preview URLs out of search indexes — only the
		// custom domain may be indexed
		if (url.hostname !== CANONICAL_HOST) {
			headers.set("X-Robots-Tag", "noindex");
		}
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	},
};
