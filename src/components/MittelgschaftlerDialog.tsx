import type { ReactNode } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { m } from "#/paraglide/messages";

/** `email` is `site.mittelgschaftlerEmail`, passed in once the caller has checked it is set. */
export function MittelgschaftlerDialog({
	email,
	children,
}: {
	email: string;
	children: ReactNode;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="border-border bg-night-soft">
				<DialogHeader>
					<DialogTitle className="font-display text-2xl text-moon">
						{m.mittel_dialog_title()}
					</DialogTitle>
					<DialogDescription className="text-base text-moon-dim">
						{m.mittel_dialog_text()}
					</DialogDescription>
				</DialogHeader>
				<p className="m-0 text-base text-moon-dim">
					{m.mittel_dialog_invite({ email })}
				</p>
				<a
					href={`mailto:${email}?subject=${encodeURIComponent(m.mittel_mail_subject())}`}
					className="mt-1 justify-self-start btn btn-primary no-underline"
				>
					{m.mittel_dialog_cta()}
				</a>
			</DialogContent>
		</Dialog>
	);
}
