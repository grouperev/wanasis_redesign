"use client";

import { useState } from "react";

/** Wraps the (server-rendered) logo track: adds the pause control WCAG 2.2.2 asks for on auto-moving content. */
export function MarqueeFrame({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="flex min-w-0 flex-1 items-center gap-4">
      <div className="marquee" data-paused={paused}>
        {children}
      </div>
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((v) => !v)}
        className="marquee_pause grid size-11 shrink-0 place-items-center rounded-sm border border-hairline text-ink-2 hover:text-ink"
      >
        <span className="sr-only">Mettre en pause le défilement</span>
        <svg aria-hidden width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
          {paused ? <path d="M1 1l10 6-10 6z" /> : <path d="M1 1h3v12H1zM8 1h3v12H8z" />}
        </svg>
      </button>
    </div>
  );
}
