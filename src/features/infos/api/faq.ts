import { queryOptions } from "@tanstack/react-query";
import { sanityClient } from "#/lib/sanity";
import { zFaqList } from "../types";

export const faqListQueryOptions = queryOptions({
	queryKey: ["faq", "list"],
	queryFn: async () => {
		const result = await sanityClient.fetch(
			`*[_type == "faqItem"] | order(order asc) { question, answer, category, order }`,
		);
		return zFaqList.parse(result);
	},
	staleTime: 5 * 60 * 1000,
});
