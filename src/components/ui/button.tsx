import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "#/lib/utils.ts";

// Maps shadcn's variant/size API onto the project's button system (.btn* in
// styles.css) so a <Button> and a hand-written <a className="btn …"> are the
// same object. Keep the API — only the styling delegates.
const buttonVariants = cva(
	"btn disabled:pointer-events-none disabled:opacity-50 aria-invalid:text-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: "btn-primary",
				destructive: "btn-destructive",
				outline: "btn-secondary",
				secondary: "btn-secondary",
				ghost: "btn-ghost",
				link: "btn-ghost underline-offset-4 hover:underline",
			},
			size: {
				default: "",
				xs: "btn-sm gap-1 [&_svg:not([class*='size-'])]:size-3",
				sm: "btn-sm",
				lg: "btn-lg",
				icon: "size-9 p-0",
				"icon-xs": "size-6 p-0 [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-8 p-0",
				"icon-lg": "size-10 p-0",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
