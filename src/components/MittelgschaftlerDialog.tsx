import type { ReactNode } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { site } from "#/lib/site";
import { m } from "#/paraglide/messages";

export function MittelgschaftlerDialog({ children }: { children: ReactNode }) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="border-border bg-night-soft">
				<DialogHeader>
					<DialogTitle className="font-display text-2xl font-bold text-moon">
						{m.mittel_dialog_title()}
					</DialogTitle>
					<DialogDescription className="text-base text-moon-dim">
						{m.mittel_dialog_text()}
					</DialogDescription>
				</DialogHeader>
				<p className="m-0 text-base text-moon-dim">
					{m.mittel_dialog_invite({ email: site.mittelgschaftlerEmail })}
				</p>
				<a
					href={`mailto:${site.mittelgschaftlerEmail}?subject=${encodeURIComponent(m.mittel_mail_subject())}`}
					className="mt-1 justify-self-start rounded-full bg-glow px-5 py-2.5 text-sm font-semibold text-night no-underline transition-colors hover:bg-glow-soft hover:text-night"
				>
					{m.mittel_dialog_cta()}
				</a>
			</DialogContent>
		</Dialog>
	);
}
