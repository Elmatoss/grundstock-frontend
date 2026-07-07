import { useSuspenseQuery } from "@tanstack/react-query";
import { localized } from "#/lib/sanity";
import { m } from "#/paraglide/messages";
import { faqListQueryOptions } from "../api/faq";
import type { FaqCategory, FaqItem } from "../types";

const CATEGORY_ORDER: { category: FaqCategory; label: () => string }[] = [
	{ category: "allgemein", label: m.faq_cat_allgemein },
	{ category: "schichten", label: m.faq_cat_schichten },
	{ category: "essen", label: m.faq_cat_essen },
	{ category: "anreise", label: m.faq_cat_anreise },
	{ category: "tickets", label: m.faq_cat_tickets },
];

function FaqAccordion({ items }: { items: [string, string][] }) {
	return (
		<div className="max-w-2xl space-y-3">
			{items.map(([question, answer]) => (
				<details
					key={question}
					className="group rounded-xl border border-border bg-night-soft/50 px-5 py-4"
				>
					<summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-moon">
						{question}
						<span
							aria-hidden
							className="text-xl text-glow transition-transform group-open:rotate-45"
						>
							+
						</span>
					</summary>
					<p className="mt-3 mb-0 text-moon-dim">{answer}</p>
				</details>
			))}
		</div>
	);
}

// Static homepage questions double as fallback while the CMS FAQ is empty
function staticFaqItems(): [string, string][] {
	return [
		[m.faq_q1(), m.faq_a1()],
		[m.faq_q2(), m.faq_a2()],
		[m.faq_q3(), m.faq_a3()],
		[m.faq_q4(), m.faq_a4()],
		[m.faq_q5(), m.faq_a5()],
	];
}

export function InfosPage() {
	const { data: faq } = useSuspenseQuery(faqListQueryOptions);

	return (
		<main className="page-wrap flex-1 py-16 sm:py-20">
			<p className="m-0 font-display text-sm font-semibold tracking-[0.2em] text-glow uppercase">
				FAQ
			</p>
			<h1 className="mt-2 mb-0 font-display text-4xl font-bold text-moon sm:text-5xl">
				{m.infos_title()}
			</h1>
			<p className="mt-4 mb-10 max-w-2xl text-lg text-moon-dim">
				{m.infos_intro()}
			</p>

			{faq.length === 0 ? (
				<FaqAccordion items={staticFaqItems()} />
			) : (
				CATEGORY_ORDER.map(({ category, label }) => {
					const items = faq.filter(
						(item: FaqItem) => (item.category ?? "allgemein") === category,
					);
					if (items.length === 0) return null;
					return (
						<section key={category} className="mt-10 first:mt-0">
							<h2 className="m-0 mb-4 font-serif text-2xl font-bold text-glow-soft">
								{label()}
							</h2>
							<FaqAccordion
								items={items.map((item) => [
									localized(item.question),
									localized(item.answer),
								])}
							/>
						</section>
					);
				})
			)}
		</main>
	);
}
