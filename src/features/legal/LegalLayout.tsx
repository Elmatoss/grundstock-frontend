interface LegalLayoutProps {
	title: string;
	children: React.ReactNode;
}

export function LegalLayout({ title, children }: LegalLayoutProps) {
	return (
		<main className="page-wrap py-16 sm:py-20">
			<h1 className="mb-8 font-display text-4xl font-bold text-moon">
				{title}
			</h1>
			<div className="prose prose-invert max-w-2xl prose-headings:font-display prose-headings:text-moon prose-p:text-moon-dim prose-li:text-moon-dim prose-a:text-glow-soft">
				{children}
			</div>
		</main>
	);
}
