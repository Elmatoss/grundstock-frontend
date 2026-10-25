import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages";

/**
 * Stands in for a link whose target does not exist yet — tickets, shifts,
 * shuttle times — while the next edition is announced but not open. Rendered
 * wherever the matching value in `src/lib/site.ts` is null or empty, so setting
 * that value brings the real link back with no other change.
 */
export function ComingSoon({
	label,
	className,
}: {
	label?: string;
	className?: string;
}) {
	return (
		<p className={cn("m-0 badge", className)}>{label ?? m.coming_soon()}</p>
	);
}
