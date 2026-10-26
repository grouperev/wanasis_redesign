import Link from "next/link";
import { CTA, SITE } from "@/lib/site";

/** Replaces the old floating sticky CTA on phones: a bottom bar that reserves its own space. */
export function MobileBar() {
  return (
    <>
      <div aria-hidden data-mobile-bar className="h-[72px] sm:hidden" />
      <div data-mobile-bar className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-surface/95 px-4 py-3 backdrop-blur-md sm:hidden">
        <div className="flex gap-3">
          <a href={`tel:${SITE.phones[0].replace(/\s/g, "")}`} className="btn btn-ghost flex-1 justify-center">
            Appeler
          </a>
          <Link href={CTA.href} className="btn btn-action flex-[2] justify-center">
            {CTA.label}
          </Link>
        </div>
      </div>
    </>
  );
}
