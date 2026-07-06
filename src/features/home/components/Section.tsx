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
			<p className="m-0 font-display text-sm font-semibold tracking-[0.2em] text-glow uppercase">
				{kicker}
			</p>
			<h2 className="mt-2 mb-0 font-display text-3xl font-bold text-moon sm:text-4xl">
				{title}
			</h2>
			<div className="mt-6">{children}</div>
		</section>
	);
}
