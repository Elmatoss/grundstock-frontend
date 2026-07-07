import { cn } from "#/lib/utils";

interface CardProps {
	title: string;
	children: React.ReactNode;
	className?: string;
}

export function Card({ title, children, className }: CardProps) {
	return (
		<article
			className={cn(
				"rounded-xl border border-border bg-night-soft/50 p-6",
				className,
			)}
		>
			<h3 className="m-0 font-display text-lg font-bold text-moon">{title}</h3>
			<div className="mt-2 text-moon-dim">{children}</div>
		</article>
	);
}
