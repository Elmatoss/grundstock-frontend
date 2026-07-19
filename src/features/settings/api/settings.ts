import { queryOptions } from "@tanstack/react-query";
import { sanityFetch } from "#/lib/sanity";
import { zSiteSettings } from "../types";

export const siteSettingsQueryOptions = queryOptions({
	queryKey: ["siteSettings"],
	queryFn: async () => {
		const result = await sanityFetch(
			`*[_type == "siteSettings"][0]{ announcement }`,
		);
		return zSiteSettings.parse(result);
	},
	staleTime: 5 * 60 * 1000,
});
