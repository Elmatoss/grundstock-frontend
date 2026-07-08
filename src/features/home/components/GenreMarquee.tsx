import { genres } from "#/lib/site";
import { m } from "#/paraglide/messages";

export function GenreMarquee() {
	const items = [...genres, m.genres_more()];

	return (
		<div className="border-y border-border py-5">
			<p className="sr-only">{items.join(", ")}</p>
			<div aria-hidden className="overflow-hidden">
				<div className="flex w-max gap-10 motion-safe:animate-marquee hover:paused">
					{[...items, ...items].map((genre, i) => (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: static duplicated list, never reordered
							key={i}
							className="flex items-center gap-10 font-display text-2xl font-semibold whitespace-nowrap text-moon-dim"
						>
							{genre}
							<span className="text-glow">✦</span>
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
