import { queryOptions } from "@tanstack/react-query";
import { sanityFetch } from "#/lib/sanity";
import { zWorkshopList } from "../types";

export const workshopListQueryOptions = (year: number) =>
	queryOptions({
		queryKey: ["edition", year, "workshops", "list"],
		queryFn: async () => {
			const result = await sanityFetch(
				`*[_type == "workshop" && edition->year == $year && defined(slug.current)] | order(dayIndex asc, start asc) {
					title,
					"slug": slug.current,
					description,
					dayIndex,
					start
				}`,
				{ year },
			);
			return zWorkshopList.parse(result);
		},
		staleTime: 5 * 60 * 1000,
	});
