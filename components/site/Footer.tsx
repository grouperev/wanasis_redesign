import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { Logo } from "./Logo";

const solutions = NAV.find((n) => n.children)?.children ?? [];

export function Footer() {
  return (
    <footer className="on-dark brand-mesh text-white">
      <div className="container-x grid gap-12 pt-20 pb-28 lg:grid-cols-12 lg:pb-16">
        <div className="lg:col-span-5">
          <Logo variant="white" />
          <p className="mt-8 max-w-[16ch] font-display text-h1 text-white">{SITE.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact/" className="btn btn-action">
              Demander une démo
            </Link>
            <Link href="/demande-de-brochure/" className="btn btn-ghost">
              Demandez notre brochure
            </Link>
          </div>
        </div>

        <nav aria-label="Solutions" className="lg:col-span-2">
          <p className="eyebrow !text-teal">Solutions</p>
          <ul className="mt-4 space-y-2 text-small">
            {solutions.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="text-white/80 hover:text-white">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Société" className="lg:col-span-2">
          <p className="eyebrow !text-teal">Société</p>
          <ul className="mt-4 space-y-2 text-small">
            {NAV.filter((n) => !n.children && n.href !== "/").map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-white/80 hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/demande-de-brochure/" className="text-white/80 hover:text-white">
                Demande de brochure
              </Link>
            </li>
          </ul>
        </nav>

        <address className="not-italic text-small lg:col-span-3">
          <p className="eyebrow !text-teal">Contact</p>
          <ul className="mt-4 space-y-2 text-white/80">
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-white">
                {SITE.email}
              </a>
            </li>
            <li>{SITE.address}</li>
            {SITE.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-white">
                  {p}
                </a>
              </li>
            ))}
            <li>{SITE.hours}</li>
          </ul>
          <ul className="mt-6 flex gap-4">
            <li>
              <a href={SITE.social.facebook} className="text-white/80 underline-offset-4 hover:text-white hover:underline" rel="noopener" target="_blank">
                Facebook
              </a>
            </li>
            <li>
              <a href={SITE.social.linkedin} className="text-white/80 underline-offset-4 hover:text-white hover:underline" rel="noopener" target="_blank">
                LinkedIn
              </a>
            </li>
          </ul>
        </address>
      </div>
      <div className="border-t border-hairline-dark">
        <p className="container-x py-6 text-small text-white/60">© {new Date().getFullYear()} {SITE.name}</p>
      </div>
    </footer>
  );
}
