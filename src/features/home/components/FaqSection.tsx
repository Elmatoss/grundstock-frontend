import { m } from "#/paraglide/messages";
import { Section } from "./Section";

export function FaqSection() {
	const items = [
		[m.faq_q1(), m.faq_a1()],
		[m.faq_q2(), m.faq_a2()],
		[m.faq_q3(), m.faq_a3()],
		[m.faq_q4(), m.faq_a4()],
		[m.faq_q5(), m.faq_a5()],
	] as const;

	return (
		<Section kicker={m.faq_kicker()} title={m.faq_title()}>
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
		</Section>
	);
}
