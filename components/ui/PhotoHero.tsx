import type { ReactNode } from "react";
import { Photo } from "./Picture";

/**
 * Full-bleed photographic hero: the shot fills the band (slow Ken Burns on load, CSS only) and a white scrim
 * from the left keeps the copy readable over the shot's planned negative space. Mobile stacks photo under copy.
 */
export function PhotoHero({ shot, label, children }: { shot: string; label: string; children: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-surface">
      <div className="hero-media absolute inset-0 -z-10 hidden lg:block">
        <Photo shot={shot} label={label} sizes="100vw" priority className="size-full" imgClassName="object-[70%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(255_255_255/0.97)_0%,rgb(255_255_255/0.9)_34%,rgb(255_255_255/0.35)_56%,transparent_72%)]" />
      </div>
      <div className="container-x py-14 lg:flex lg:min-h-[min(760px,calc(100svh-var(--header-h)))] lg:items-center lg:py-24">
        <div className="max-w-[40rem]">{children}</div>
      </div>
      <div className="hero-media lg:hidden">
        <Photo shot={shot} label={label} sizes="100vw" ratio="4/3" className="w-full" />
      </div>
    </section>
  );
}

/** Full-width photographic band with a slow parallax drift (CSS scroll timeline). */
export function PhotoBand({ shot, label, ratio = "21/9" }: { shot: string; label: string; ratio?: string }) {
  return (
    <div className="parallax relative">
      <Photo shot={shot} label={label} sizes="100vw" ratio={ratio} className="w-full max-sm:aspect-[4/3]" />
    </div>
  );
}
