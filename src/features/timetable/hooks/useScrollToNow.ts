import { useEffect, useRef } from "react";
import type { Slot } from "../lib/schedule";

/** DOM id for a set's row, so the page can be scrolled to it. */
export function slotDomId(slot: Slot) {
	return `slot-${slot.key}`;
}

// Where the target lands vertically: upper third rather than centred, so the
// screen below it fills with what is coming up next — which is the whole reason
// for scrolling here instead of showing an "up next" card.
const VIEWPORT_FRACTION = 0.28;

function prefersReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToSlotId(elementId: string, smooth: boolean) {
	const element = document.getElementById(elementId);
	if (!element) return false;
	const top = element.getBoundingClientRect().top + window.scrollY;
	window.scrollTo({
		top: Math.max(0, top - window.innerHeight * VIEWPORT_FRACTION),
		behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto",
	});
	return true;
}

/**
 * On opening the timetable during the festival, travel to whatever is on right
 * now.
 *
 * Smooth rather than an instant jump on purpose: landing halfway down a long page
 * with no explanation is disorienting, whereas being carried there reads as the
 * page taking you to the present — and the browser caps smooth-scroll duration,
 * so the distance does not make it slow.
 *
 * Fires once. It must never re-fire when the clock ticks over to the next act, or
 * it would yank the page out from under somebody reading Saturday. Anything that
 * signals the visitor already chose a position — a `#tag-sa` deep link, a restored
 * scroll offset — wins outright.
 */
export function useScrollToNow(elementId: string | null, enabled: boolean) {
	const settled = useRef(false);

	useEffect(() => {
		if (settled.current || !enabled || !elementId) return;
		if (window.location.hash || window.scrollY > 0) {
			settled.current = true;
			return;
		}
		// One frame late: row heights and the sticky headers need to have been laid
		// out before an offset measured from the top means anything
		const frame = requestAnimationFrame(() => {
			if (scrollToSlotId(elementId, true)) settled.current = true;
		});
		return () => cancelAnimationFrame(frame);
	}, [elementId, enabled]);
}
