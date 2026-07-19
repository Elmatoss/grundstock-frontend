import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Footer from "#/components/Footer";
import Header from "#/components/Header";
import { NightBackground } from "#/components/NightBackground";
import NotFound from "#/components/NotFound";
import { siteSettingsQueryOptions } from "#/features/settings/api/settings";
import { AnnouncementBanner } from "#/features/settings/components/AnnouncementBanner";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";
import { getLocale } from "#/paraglide/runtime";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
		// Other redirect strategies are possible; see
		// https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("lang", getLocale());
		}
	},

	loader: ({ context }) =>
		context.queryClient.prefetchQuery(siteSettingsQueryOptions),

	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: m.meta_title() },
			{ name: "description", content: m.meta_description() },
			{ name: "theme-color", content: "#120826" },
			{ property: "og:site_name", content: "Grundstock Festival" },
			{ property: "og:type", content: "website" },
			{ property: "og:title", content: m.meta_title() },
			{ property: "og:description", content: m.meta_description() },
			{ property: "og:url", content: `${site.baseUrl}/` },
			{ property: "og:image", content: `${site.baseUrl}/og-image.jpg` },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:alt", content: "Grundstock Festival" },
			{
				property: "og:locale",
				content: getLocale() === "de" ? "de_DE" : "en_GB",
			},
			{
				property: "og:locale:alternate",
				content: getLocale() === "de" ? "en_GB" : "de_DE",
			},
			{ name: "twitter:card", content: "summary_large_image" },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
			{ rel: "manifest", href: "/manifest.json" },
		],
		scripts: site.cfBeaconToken
			? [
					{
						src: "https://static.cloudflareinsights.com/beacon.min.js",
						defer: true,
						"data-cf-beacon": JSON.stringify({ token: site.cfBeaconToken }),
					},
				]
			: [],
	}),
	notFoundComponent: NotFound,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang={getLocale()} suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="font-sans antialiased wrap-anywhere">
				<NightBackground />
				<div className="flex min-h-svh flex-col">
					<a
						href="#main"
						className="absolute top-3 left-3 z-70 -translate-y-24 rounded-full bg-glow px-4 py-2 font-semibold text-night no-underline opacity-0 focus:translate-y-0 focus:opacity-100"
					>
						{m.skip_to_content()}
					</a>
					<AnnouncementBanner />
					<Header />
					<div id="main" tabIndex={-1} className="flex flex-1 flex-col">
						{children}
					</div>
					<Footer />
				</div>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
