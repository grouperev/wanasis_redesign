"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CTA, NAV } from "@/lib/site";
import { Logo } from "./Logo";

/**
 * v0 header. Desktop: inline nav + Solutions disclosure + header CTA.
 * ≤1024px: menu button → drawer. The Annnimate multi-level-drawer-menu replaces the drawer in Phase 5.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solutions, setSolutions] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const solRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation (render-time state adjustment, no effect needed).
  const [navPath, setNavPath] = useState(pathname);
  if (navPath !== pathname) {
    setNavPath(pathname);
    setOpen(false);
    setSolutions(false);
  }

  useEffect(() => {
    if (!solutions) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !solRef.current?.contains(e.target as Node)) setSolutions(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [solutions]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-40 h-[var(--header-h)] bg-surface/90 backdrop-blur-md transition-[border-color] duration-300 border-b ${
        scrolled ? "border-hairline" : "border-transparent"
      }`}
    >
      <div className="container-x flex h-full items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1 font-display text-[0.9375rem] uppercase tracking-[0.06em]">
            {NAV.map((item) =>
              item.children ? (
                <li key={item.label} ref={solRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={solutions}
                    aria-controls="menu-solutions"
                    onClick={() => setSolutions((v) => !v)}
                    className={`flex items-center gap-1.5 rounded-xs px-3 py-2 uppercase tracking-[0.06em] hover:text-teal-ink ${
                      isActive("/wanasis-") || isActive("/mobile-") ? "text-teal-ink" : ""
                    }`}
                  >
                    {item.label}
                    <svg aria-hidden width="10" height="6" viewBox="0 0 10 6" className={`transition-transform duration-150 ${solutions ? "rotate-180" : ""}`}>
                      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                  <div
                    id="menu-solutions"
                    hidden={!solutions}
                    className="absolute left-1/2 top-full mt-3 w-[520px] -translate-x-1/2 rounded-lg border border-hairline bg-surface p-3 shadow-e2 normal-case tracking-normal"
                  >
                    <ul className="grid grid-cols-2 gap-1 font-sans text-body">
                      {item.children.slice(0, 2).map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block rounded-md p-4 hover:bg-surface-2">
                            <span className="block font-display text-h3 leading-tight">{c.label}</span>
                            <span className="mt-1 block text-small text-ink-2">{c.note}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 border-t border-hairline px-4 pt-3 font-display text-small uppercase tracking-[0.08em] text-ink-2">
                      Applications mobiles
                    </p>
                    <ul className="grid grid-cols-4 gap-1 p-1 text-small">
                      {item.children.slice(2).map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block rounded-xs px-3 py-2 hover:bg-surface-2">
                            {c.label.replace("Mobile ", "")}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`block rounded-xs px-3 py-2 hover:text-teal-ink ${isActive(item.href) ? "text-teal-ink" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link href={CTA.href} className="btn btn-action hidden sm:inline-flex">
            {CTA.label}
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-sm border border-hairline lg:hidden"
            aria-expanded={open}
            aria-controls="drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
            <svg aria-hidden width="20" height="14" viewBox="0 0 20 14">
              {open ? (
                <path d="M3 1l14 12M17 1L3 13" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div id="drawer" hidden={!open} className="fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 overflow-y-auto bg-surface lg:hidden">
        <nav aria-label="Navigation mobile" className="container-x py-6">
          <ul className="divide-y divide-hairline font-display text-h3">
            {NAV.map((item) => (
              <li key={item.label} className="py-3">
                <Link href={item.href} className="block py-1">
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mt-2 grid grid-cols-2 gap-2 font-sans text-body">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded-sm bg-surface-2 px-3 py-2.5">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
