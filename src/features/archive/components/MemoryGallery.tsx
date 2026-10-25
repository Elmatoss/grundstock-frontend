import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "#/components/ui/dialog";
import { VideoEmbed } from "#/components/VideoEmbed";
import { localized, sanityImageProps } from "#/lib/sanity";
import { m } from "#/paraglide/messages";
import type { Memory } from "../types";

/**
 * Pictures and clips from a past festival.
 *
 * Every tile is an image, including the clips — a clip's picture is its poster —
 * so the grid has one shape and one interaction: click to open it large. Nothing
 * loads from YouTube until somebody presses play inside the dialog.
 *
 * What reaches this component is already consent-gated in GROQ (see
 * memoryListQueryOptions), so there is no filtering to forget here.
 */
export function MemoryGallery({ memories }: { memories: Memory[] }) {
	const [open, setOpen] = useState<Memory | null>(null);

	return (
		<>
			{/* CSS columns rather than a grid: photos from a festival are a mix of
			    portrait and landscape, and a masonry flow keeps them at their own
			    aspect ratio instead of cropping every one to a square */}
			<div className="mt-6 columns-2 gap-4 lg:columns-3 [&>*]:mb-4">
				{memories.map((memory) => (
					<button
						key={memory.id}
						type="button"
						onClick={() => setOpen(memory)}
						className="group relative block w-full cursor-pointer overflow-hidden rounded-xs border border-border p-0"
					>
						<img
							{...sanityImageProps(memory.image, 640, 480)}
							sizes="(min-width: 1024px) 320px, 45vw"
							alt={memory.image.alt ?? localized(memory.caption)}
							loading="lazy"
							className="h-auto w-full transition-opacity group-hover:opacity-85"
						/>
						{memory.youtubeId && (
							<span className="absolute inset-0 flex items-center justify-center">
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									className="h-10 w-10 text-glow drop-shadow-[0_0_18px_rgba(240,169,60,0.5)]"
									fill="currentColor"
								>
									<path d="M8 5v14l11-7z" />
								</svg>
							</span>
						)}
					</button>
				))}
			</div>

			<Dialog open={open !== null} onOpenChange={() => setOpen(null)}>
				{/* aria-describedby={undefined}: the picture *is* the content, so there
				    is nothing to describe beyond the title — without this Radix warns
				    about a missing description on every open */}
				<DialogContent
					aria-describedby={undefined}
					className="max-w-3xl border-border bg-night-soft"
				>
					{open && (
						<>
							{/* The dialog needs an accessible name; the caption is the
							    natural one, and many memories have none */}
							<DialogTitle className="font-display text-lg text-moon">
								{localized(open.caption) || m.archive_memories_title()}
							</DialogTitle>
							{open.youtubeId ? (
								<VideoEmbed
									youtubeId={open.youtubeId}
									title={localized(open.caption) || m.recap_play()}
									poster={sanityImageProps(open.image, 960, 540).src}
								/>
							) : (
								<img
									{...sanityImageProps(open.image, 1200, 900)}
									sizes="(min-width: 768px) 720px, 92vw"
									alt={open.image.alt ?? localized(open.caption)}
									className="h-auto w-full rounded-xs"
								/>
							)}
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
