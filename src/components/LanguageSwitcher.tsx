import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import { getLocale, locales, setLocale } from "#/paraglide/runtime";

export function LanguageSwitcher() {
	const current = getLocale();

	return (
		<nav
			aria-label={m.lang_switch()}
			className="flex items-center font-display text-sm font-semibold"
		>
			{locales.map((locale, index) => (
				<span key={locale} className="flex items-center">
					{index > 0 && (
						<span aria-hidden className="text-moon-dim/50">
							/
						</span>
					)}
					<button
						type="button"
						onClick={() => setLocale(locale)}
						aria-current={current === locale ? "true" : undefined}
						lang={locale}
						className={cn(
							"px-1 py-1 uppercase transition-colors",
							current === locale
								? "text-glow"
								: "text-moon-dim hover:text-moon",
						)}
					>
						{locale}
					</button>
				</span>
			))}
		</nav>
	);
}
