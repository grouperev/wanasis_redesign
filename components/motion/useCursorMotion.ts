"use client";

import { useSyncExternalStore } from "react";
import { FINE_POINTER_QUERY, REDUCED_QUERY, canAnimateWithCursor } from "@/lib/motion";

function subscribe(onChange: () => void) {
  const lists = [window.matchMedia(REDUCED_QUERY), window.matchMedia(FINE_POINTER_QUERY)];
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

/** true only on a mouse-like pointer with no reduced-motion preference. Always false on the server and during hydration. */
export function useCursorMotion(): boolean {
  return useSyncExternalStore(subscribe, canAnimateWithCursor, () => false);
}

function subscribeReduced(onChange: () => void) {
  const l = window.matchMedia(REDUCED_QUERY);
  l.addEventListener("change", onChange);
  return () => l.removeEventListener("change", onChange);
}

/** true when motion is allowed (any pointer). Always false on the server and during hydration. */
export function useMotionAllowed(): boolean {
  return useSyncExternalStore(subscribeReduced, () => !window.matchMedia(REDUCED_QUERY).matches, () => false);
}
