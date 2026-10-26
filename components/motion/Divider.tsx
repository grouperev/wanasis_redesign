"use client";

import dynamic from "next/dynamic";
import { useCursorMotion } from "./useCursorMotion";

// GSAP is only fetched when the cursor can actually play with the line.
const ElasticDivider = dynamic(() => import("@/components/annnimate/elastic-divider/elastic-divider"), { ssr: false });

/**
 * 1px teal section line. A fine pointer sweeping across it makes it ring like a string (elastic-divider).
 * Touch, keyboard-only and reduced motion get the static line. The 64px stage is the same in both states (CLS 0).
 */
export function Divider({ className = "" }: { className?: string }) {
  const live = useCursorMotion();
  return (
    <div aria-hidden="true" className={`group container-x relative h-16 text-teal ${className}`}>
      <div className="absolute inset-x-0 top-1/2 h-px bg-current group-has-[.eldv_path[d]]:invisible" />
      {live && <ElasticDivider color="currentColor" weight={1} />}
    </div>
  );
}
