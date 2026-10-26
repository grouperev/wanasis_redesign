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
@media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
  h1[data-reveal]:not([data-revealed]) { opacity: .2; }
}
.mr-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.mr-scr { position: relative; display: inline-block; white-space: nowrap; }
.mr-scr-spacer { visibility: hidden; }
.mr-scr-layer { position: absolute; left: 0; top: 0; pointer-events: none; }
.mr-scr-accent { color: ${colors.scramble}; }
.mr-scr-final { color: inherit; }
`;

const SELECTOR = "[data-reveal]:not([data-motion-done]), [data-scramble]:not([data-motion-done])";

export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let engine: { scan: (root?: ParentNode) => void; destroy: () => void } | null = null;
    let observer: MutationObserver | null = null;
    let raf = 0;

    const hasTargets = () => document.querySelector(SELECTOR) !== null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Safety net: if the engine can't load, a pre-dimmed h1 must never stay dim.
    const safety = window.setTimeout(() => {
      document.querySelectorAll("h1[data-reveal]:not([data-revealed])").forEach((el) => el.setAttribute("data-revealed", ""));
    }, 2500);

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
      void start();
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
      window.clearTimeout(safety);
      cancelAnimationFrame(raf);
      observer?.disconnect();
      engine?.destroy();
    };
  }, [pathname]);

  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}
