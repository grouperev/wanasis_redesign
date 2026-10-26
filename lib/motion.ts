/**
 * Single source of motion tokens (design-system.md §Motion).
 * GSAP ease for the brand curve cubic-bezier(.22,1,.36,1) is "power3.out" (visually equivalent, no CustomEase needed).
 * Everything animated on the site reads from here; nothing hard-codes a duration, ease or brand color.
 */
export const ease = "power3.out";
export const easeInOut = "power3.inOut";
/** Long, soft landing for wheels and flings. */
export const easeSpin = "expo.out";
/** CSS twin of `ease`, for transitions written in stylesheets. */
export const easeCss = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Seconds. hover/focus 150ms, UI 300ms, layout 450ms, H1 reveal total 800ms. */
export const duration = { hover: 0.15, ui: 0.3, layout: 0.45, reveal: 0.8 } as const;
export const stagger = 0.06;

/** Brand colors used by the scramble: starts teal, resolves to the surrounding text color (ink on light, white on dark). */
export const colors = { scramble: "#1CB1BD", ink: "#0B1F2E", onDark: "#FFFFFF" } as const;

export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
/** Mouse-like pointer: the only context where cursor-reactive effects are enabled. */
export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;
}

export function hasFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia(FINE_POINTER_QUERY).matches;
}

/** Full cursor-reactive / ambient motion allowed: fine pointer and no reduced-motion preference. */
export function canAnimateWithCursor(): boolean {
  return hasFinePointer() && !prefersReducedMotion();
}
