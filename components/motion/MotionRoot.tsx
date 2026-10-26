"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { colors } from "@/lib/motion";

/**
 * Mounted once in app/layout.tsx. Wires, on every page and on each client navigation:
 *  - h1[data-reveal] (or any [data-reveal])  -> word-by-word reveal
 *  - [data-scramble]                          -> dual-scramble on scroll-in, once
 * It does nothing (and downloads nothing) when no element carries these attributes or under prefers-reduced-motion.
 * New elements that appear later (lazy sections) are picked up by a MutationObserver.
 */
const CSS = `
.mr-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.mr-scr { position: relative; display: inline-block; white-space: nowrap; }
.mr-scr-spacer { visibility: hidden; }
.mr-scr-layer { position: absolute; left: 0; top: 0; pointer-events: none; }
.mr-scr-accent { color: ${colors.scramble}; }
.mr-scr-final { color: inherit; }
`;

const SELECTOR = "[data-reveal]:not([data-motion-done]), [data-scramble]:not([data-motion-done])";

// The first page view paints its h1 at full strength (it is often the LCP); the word reveal plays on client
// navigations only. GSAP is fetched when the main thread is idle, so it never competes with hydration.
let firstView = true;
const whenIdle = (fn: () => void) => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(fn, { timeout: 2000 });
  else setTimeout(fn, 1200);
};

export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let engine: { scan: (root?: ParentNode) => void; destroy: () => void } | null = null;
    let observer: MutationObserver | null = null;
    let raf = 0;

    const hasTargets = () => document.querySelector(SELECTOR) !== null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const initial = firstView;
    firstView = false;
    if (initial) {
      document.querySelectorAll("h1[data-reveal]").forEach((el) => {
        el.setAttribute("data-revealed", "");
        el.setAttribute("data-motion-done", "");
      });
    }

    const start = async () => {
      if (cancelled || engine || !hasTargets()) return;
      const mod = await import("./motion-engine");
      if (cancelled) return;
      engine = mod.createMotion();
      engine.scan();
    };

    if (reduced) {
      document.querySelectorAll("h1[data-reveal]").forEach((el) => el.setAttribute("data-revealed", ""));
    } else {
      if (initial) whenIdle(() => void start());
      else void start();
      observer = new MutationObserver((records) => {
        // Ignore our own DOM edits and text ticks; react only to new nodes that carry (or contain) a target.
        const fresh = records.some((r) =>
          Array.from(r.addedNodes).some((n) => n instanceof HTMLElement && (n.matches(SELECTOR) || n.querySelector(SELECTOR) !== null)),
        );
        if (!fresh) return;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          if (engine) engine.scan();
          else void start();
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      engine?.destroy();
    };
  }, [pathname]);

  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}
