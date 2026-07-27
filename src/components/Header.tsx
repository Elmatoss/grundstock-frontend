import { Link } from "@tanstack/react-router";
import { LanguageSwitcher } from "#/components/LanguageSwitcher";
import { LogoMark } from "#/components/LogoMark";
import { SiteMenu } from "#/components/SiteMenu";
import { m } from "#/paraglide/messages";

export default function Header() {
	const anchors = [["helfen", m.nav_helfen()]] as const;

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-night/70 backdrop-blur-md">
			<nav className="page-wrap flex items-center justify-between gap-4 py-3">
				<Link
					to="/"
					className="flex items-center gap-2.5 text-moon no-underline hover:text-moon"
				>
					<LogoMark className="h-6" />
					<span className="wordmark text-base sm:text-lg">
						Grundstock <span className="text-glow">2026</span>
					</span>
				</Link>
				<div className="hidden items-center gap-6 md:flex">
					<Link
						to="/lineup"
						className="text-sm font-semibold text-moon-dim no-underline transition-colors hover:text-moon"
						activeProps={{ className: "text-moon" }}
					>
						{m.nav_lineup()}
					</Link>
					<Link
						to="/workshops"
						className="text-sm font-semibold text-moon-dim no-underline transition-colors hover:text-moon"
						activeProps={{ className: "text-moon" }}
					>
						{m.nav_workshops()}
					</Link>
					{anchors.map(([hash, label]) => (
						<Link
							key={hash}
							to="/"
							hash={hash}
							className="text-sm font-semibold text-moon-dim no-underline transition-colors hover:text-moon"
						>
							{label}
						</Link>
					))}
					<Link
						to="/anreise"
						className="text-sm font-semibold text-moon-dim no-underline transition-colors hover:text-moon"
						activeProps={{ className: "text-moon" }}
					>
						{m.nav_anreise()}
					</Link>
					<Link
						to="/infos"
						className="text-sm font-semibold text-moon-dim no-underline transition-colors hover:text-moon"
						activeProps={{ className: "text-moon" }}
					>
						{m.nav_infos()}
					</Link>
				</div>
				<div className="flex items-center gap-3">
					<LanguageSwitcher />
					<SiteMenu />
				</div>
			</nav>
		</header>
	);
}
