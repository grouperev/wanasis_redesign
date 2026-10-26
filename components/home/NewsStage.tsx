"use client";

import { useState } from "react";
import ScaleSlider, { type ScaleSlide } from "@/components/annnimate/scale-slider/scale-slider";
import { useMotionAllowed } from "@/components/motion/useCursorMotion";

type Props = {
  /** The static rail (server-rendered). Always in the flow, so the section height is the same with or without the slider. */
  children: React.ReactNode;
  posts: ScaleSlide[];
  labels: { region: string; prev: string; next: string; status: string };
};

/**
 * Progressive enhancement of the news rail: with motion allowed, the scale-slider is laid over the rail and the rail is
 * hidden (and inert) once the slider is ready. Reduced motion / no JS / before the engine loads: the rail, unchanged.
 */
export function NewsStage({ children, posts, labels }: Props) {
  const motion = useMotionAllowed();
  const [live, setLive] = useState(false);
  return (
    <div className="relative">
      <div className={live ? "invisible" : undefined} inert={live}>
        {children}
      </div>
      {motion && <ScaleSlider posts={posts} labels={labels} onReady={() => setLive(true)} />}
    </div>
  );
}
