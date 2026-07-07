import logoUrl from "#/assets/logo.png";

// The logo artwork is flat black on transparency, so it's used as a CSS mask:
// the mark takes whatever text color the parent sets (text-moon, text-glow, …).
// Size via height class; width follows the artwork's aspect ratio.
export function LogoMark({ className = "" }: { className?: string }) {
	return (
		<span
			aria-hidden="true"
			className={`inline-block bg-current ${className}`}
			style={{
				aspectRatio: "600 / 413",
				maskImage: `url(${logoUrl})`,
				maskSize: "contain",
				maskRepeat: "no-repeat",
				maskPosition: "center",
				WebkitMaskImage: `url(${logoUrl})`,
				WebkitMaskSize: "contain",
				WebkitMaskRepeat: "no-repeat",
				WebkitMaskPosition: "center",
			}}
		/>
	);
}
