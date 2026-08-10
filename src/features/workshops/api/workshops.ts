import { queryOptions } from "@tanstack/react-query";
import { sanityFetch } from "#/lib/sanity";
import { zWorkshopList } from "../types";

export const workshopListQueryOptions = queryOptions({
	queryKey: ["workshops", "list"],
	queryFn: async () => {
		const result = await sanityFetch(
			`*[_type == "workshop" && defined(slug.current)] | order(day asc, start asc) {
				title,
				"slug": slug.current,
				description,
				day,
				start
			}`,
		);
		return zWorkshopList.parse(result);
	},
	staleTime: 5 * 60 * 1000,
});
