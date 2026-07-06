import { shuttles, site } from "#/lib/site";
import { m } from "#/paraglide/messages";
import { Card } from "./Card";

const dayLabel: Record<string, () => string> = {
	Do: m.day_do,
	Fr: m.day_fr,
	So: m.day_so,
};

export function ShuttleTables() {
	const outbound = shuttles.filter((s) => s.direction === "hin");
	const inbound = shuttles.filter((s) => s.direction === "zurueck");

	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<Card title={m.shuttle_hin()}>
				<ul className="m-0 list-none space-y-1 p-0">
					{outbound.map((s) => (
						<li key={s.day} className="flex justify-between gap-4">
							<span>{dayLabel[s.day]()}</span>
							<span className="text-moon tabular-nums">
								{s.times.join(" · ")}
							</span>
						</li>
					))}
				</ul>
			</Card>
			<Card title={m.shuttle_zurueck()}>
				<ul className="m-0 list-none space-y-1 p-0">
					{inbound.map((s) => (
						<li key={s.day} className="flex justify-between gap-4">
							<span>{dayLabel[s.day]()}</span>
							<span className="text-moon tabular-nums">
								{s.times.join(" · ")}
							</span>
						</li>
					))}
				</ul>
				<a
					href={site.ticketUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-4 inline-block text-sm font-semibold"
				>
					{m.cta_tickets()} →
				</a>
			</Card>
		</div>
	);
}
