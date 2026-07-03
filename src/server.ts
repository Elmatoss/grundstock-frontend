import handler from "@tanstack/react-start/server-entry";
import { paraglideMiddleware } from "#/paraglide/server";

export default {
	fetch(request: Request) {
		// Scopes the request's locale via AsyncLocalStorage so getLocale()/m.*()
		// resolve correctly during SSR. The handler must receive the ORIGINAL
		// (still localized) URL — the router's rewrite.input de-localizes it;
		// passing the middleware's de-localized request makes the router see a
		// URL mismatch and 307-loop.
		return paraglideMiddleware(request, () => handler.fetch(request));
	},
};
