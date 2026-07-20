import type { CSSProperties } from "react";
import { genres } from "#/lib/site";
import { m } from "#/paraglide/messages";

const MARQUEE_COPY_COUNT = 8;
const marqueeTrackStyle = {
	"--marquee-shift": `-${100 / MARQUEE_COPY_COUNT}%`,
} as CSSProperties;

export function GenreMarquee() {
	const items = [...genres, m.genres_more()];

	return (
		<div className="border-y border-border py-5">
			<p className="sr-only">{items.join(", ")}</p>
			<div aria-hidden className="overflow-hidden">
				<div
					className="flex w-max motion-safe:animate-marquee hover:paused"
					style={marqueeTrackStyle}
				>
					{Array.from({ length: MARQUEE_COPY_COUNT }, (_, copyIndex) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: static copies never reorder
							key={copyIndex}
							className="flex shrink-0 gap-10 pr-10"
						>
							{items.map((genre) => (
								<span
									key={genre}
									className="flex items-center gap-10 font-display text-2xl font-semibold whitespace-nowrap text-moon-dim"
								>
									{genre}
									<span className="text-glow">✦</span>
								</span>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
