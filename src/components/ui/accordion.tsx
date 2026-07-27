import { PlusIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "#/lib/utils.ts";

function Accordion({
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
	return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
	return (
		<AccordionPrimitive.Item
			data-slot="accordion-item"
			className={cn(
				"inner-edge rounded-xs border border-border bg-night-soft/50 px-5 transition-colors has-data-[state=open]:border-glow/30",
				className,
			)}
			{...props}
		/>
	);
}

function AccordionTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				data-slot="accordion-trigger"
				className={cn(
					"flex flex-1 cursor-pointer items-center justify-between gap-4 py-4 text-left font-semibold text-moon outline-none transition-colors hover:text-glow-soft focus-visible:ring-[3px] focus-visible:ring-ring/50",
					className,
				)}
				{...props}
			>
				{children}
				<PlusIcon className="size-5 shrink-0 text-glow transition-transform duration-300 ease-out [[data-state=open]>&]:rotate-45" />
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}

function AccordionContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
	return (
		// Radix measures the panel and exposes --radix-accordion-content-height,
		// which is what makes a real height transition possible — plain <details>
		// can't animate open/close at all.
		<AccordionPrimitive.Content
			data-slot="accordion-content"
			className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
			{...props}
		>
			<div className={cn("pb-4 text-moon-dim", className)}>{children}</div>
		</AccordionPrimitive.Content>
	);
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
