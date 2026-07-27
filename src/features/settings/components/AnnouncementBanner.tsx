import { useQuery } from "@tanstack/react-query";
import { localized } from "#/lib/sanity";
import { siteSettingsQueryOptions } from "../api/settings";

export function AnnouncementBanner() {
	const { data: settings } = useQuery(siteSettingsQueryOptions);
	const text = localized(settings?.announcement).trim();
	if (!text) return null;

	return (
		<div className="border-b border-glow/30 bg-glow/10">
			<p className="page-wrap m-0 py-2 text-center text-sm font-medium text-glow-soft">
				{text}
			</p>
		</div>
	);
}
