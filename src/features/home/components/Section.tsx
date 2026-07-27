import { cn } from "#/lib/utils";

interface SectionProps {
	id?: string;
	kicker: string;
	title: string;
	children: React.ReactNode;
	className?: string;
}

export function Section({
	id,
	kicker,
	title,
	children,
	className,
}: SectionProps) {
	return (
		<section
			id={id}
			className={cn("page-wrap scroll-mt-24 py-16 sm:py-20", className)}
		>
			{/* Kicker in tracked uppercase sans, heading in the display serif — the
			    contrast between the two is what carries the editorial look */}
			<p className="m-0 text-xs font-semibold tracking-[0.25em] text-glow uppercase">
				{kicker}
			</p>
			<h2 className="mt-3 mb-0 font-display text-4xl text-moon sm:text-5xl">
				{title}
			</h2>
			<div className="mt-6">{children}</div>
		</section>
	);
}
