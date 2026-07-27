import { Link } from "@tanstack/react-router";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion";
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
			<Accordion type="single" collapsible className="max-w-2xl space-y-3">
				{items.map(([question, answer]) => (
					<AccordionItem key={question} value={question}>
						<AccordionTrigger>{question}</AccordionTrigger>
						<AccordionContent>{answer}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<Link
				to="/infos"
				className="mt-6 inline-block rounded-xs border border-glow/40 bg-glow/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-glow-soft uppercase no-underline transition-colors hover:border-glow hover:text-glow"
			>
				{m.faq_more()} →
			</Link>
		</Section>
	);
}
