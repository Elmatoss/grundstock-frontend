import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LogoMark } from "#/components/LogoMark";
import { m } from "#/paraglide/messages";
import { localizeHref } from "#/paraglide/runtime";

// Curated: content pages only — legal boilerplate (Impressum, Datenschutz,
// Ticketbedingungen) stays footer-only
const MENU_ITEMS = [
	{ to: "/", label: () => m.menu_home() },
	{ to: "/lineup", label: () => m.nav_lineup() },
	{ to: "/timetable", label: () => m.nav_timetable() },
	{ to: "/workshops", label: () => m.nav_workshops() },
	{ to: "/anreise", label: () => m.nav_anreise() },
	{ to: "/infos", label: () => m.nav_infos() },
	{ to: "/verein", label: () => m.nav_verein() },
	{ to: "/festival-policy", label: () => m.footer_policy() },
] as const;

export function SiteMenu() {
	const [open, setOpen] = useState(false);
	// The overlay is portaled to <body>: the sticky header's backdrop-blur
	// creates a containing block, which would trap fixed positioning inside
	// the header bar. Portals don't SSR, so mount-gate it.
	const [mounted, setMounted] = useState(false);
	const closeRef = useRef<HTMLButtonElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => setMounted(true), []);

	useEffect(() => {
		if (!open) return;
		closeRef.current?.focus();
		document.body.style.overflow = "hidden";
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
			// aria-modal promises a focus trap: cycle Tab within the overlay
			if (event.key === "Tab") {
				const focusables = overlayRef.current?.querySelectorAll<HTMLElement>(
					"a[href], button:not([disabled])",
				);
				if (!focusables || focusables.length === 0) return;
				const first = focusables[0];
				const last = focusables[focusables.length - 1];
				const active = document.activeElement;
				if (!overlayRef.current?.contains(active)) {
					event.preventDefault();
					first.focus();
				} else if (event.shiftKey && active === first) {
					event.preventDefault();
					last.focus();
				} else if (!event.shiftKey && active === last) {
					event.preventDefault();
					first.focus();
				}
			}
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKey);
			triggerRef.current?.focus();
		};
	}, [open]);

	const overlay = (
		<div
			ref={overlayRef}
			role="dialog"
			aria-modal="true"
			aria-label={m.menu_open()}
			className={`fixed inset-0 z-60 flex flex-col overflow-y-auto bg-night/95 backdrop-blur-lg transition-[opacity,visibility] duration-300 motion-reduce:transition-none ${
				open ? "visible opacity-100" : "invisible opacity-0"
			}`}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 overflow-hidden"
			>
				<LogoMark className="absolute -right-20 -bottom-12 h-[50vh] text-glow opacity-5" />
			</div>

			<div className="page-wrap flex items-center justify-between py-3">
				<span className="flex items-center gap-2.5 text-moon">
					<LogoMark className="h-6" />
					<span className="wordmark text-base sm:text-lg">
						Grundstock <span className="text-glow">2026</span>
					</span>
				</span>
				<button
					ref={closeRef}
					type="button"
					onClick={() => setOpen(false)}
					aria-label={m.menu_close()}
					className="btn btn-ghost"
				>
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						width="26"
						height="26"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
					>
						<path d="M5 5l14 14M19 5L5 19" />
					</svg>
				</button>
			</div>

			<nav className="page-wrap relative flex flex-1 flex-col justify-center gap-1 py-8">
				{MENU_ITEMS.map((item, index) => (
					<Link
						key={item.to}
						to={item.to}
						onClick={() => setOpen(false)}
						style={{ transitionDelay: open ? `${80 + index * 40}ms` : "0ms" }}
						className={`w-fit py-1.5 font-display text-3xl text-moon no-underline transition-[opacity,transform,color] duration-500 hover:text-glow motion-reduce:transform-none motion-reduce:transition-none sm:text-5xl ${
							open
								? "translate-y-0 opacity-100"
								: "translate-y-4 opacity-0 motion-reduce:opacity-0"
						}`}
						activeProps={{ className: "text-glow-soft" }}
						activeOptions={{ exact: item.to === "/" }}
					>
						{item.label()}
					</Link>
				))}
			</nav>

			<div
				style={{ transitionDelay: open ? "400ms" : "0ms" }}
				className={`page-wrap relative flex flex-wrap items-center gap-3 pb-10 transition-[opacity,transform] duration-500 motion-reduce:transform-none motion-reduce:transition-none ${
					open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
				}`}
			>
				<a
					href={localizeHref("/tickets")}
					target="_blank"
					rel="noopener noreferrer"
					className="btn btn-primary btn-lg no-underline"
				>
					{m.cta_tickets()}
				</a>
				<Link
					to="/"
					hash="helfen"
					onClick={() => setOpen(false)}
					className="btn btn-secondary btn-lg no-underline"
				>
					{m.cta_helfen()}
				</Link>
			</div>
		</div>
	);

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen(true)}
				aria-label={m.menu_open()}
				className="btn btn-ghost"
			>
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					width="26"
					height="26"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
				>
					<path d="M3 6h18M3 12h18M3 18h18" />
				</svg>
			</button>
			{mounted ? createPortal(overlay, document.body) : null}
		</>
	);
}
