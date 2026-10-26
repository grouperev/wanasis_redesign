'use client';

/*
 * Wanasis adaptation of vendor/annnimate/multi-level-drawer-menu.
 * Kept from the original: a left sheet revealed by an animated clip-path, staggered link entrance, a second level that
 * slides over the first (the original's mobile behaviour), the dim layer and the "Menu" toggle owned by the host.
 * Changed: data-driven from NAV (real <Link>s), colours/durations from tokens + lib/motion, and the accessibility the
 * original lacks: focus trap (including the header controls), Escape (closes level 2, then the drawer), focus restore,
 * body scroll lock, inert page behind, reduced motion (final state, no animation).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { duration, ease, prefersReducedMotion, stagger } from '@/lib/motion';
import './multi-level-drawer-menu.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

const CLIP_HIDDEN = 'inset(0% 100% 0% 0%)';
const CLIP_VISIBLE = 'inset(0% 0% 0% 0%)';
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const PAGE_BEHIND = 'main, footer, [data-mobile-bar]';

/**
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {Array<{label: string, href: string, children?: Array<{label: string, href: string, note?: string}>}>} items
 * @param {{label: string, href: string}} cta
 * @param {string} pathname  current route, for aria-current
 * @param {React.RefObject<HTMLElement>} toggleRef  the header button; focus returns to it on close
 * @param {string} id
 */
export default function MultiLevelDrawerMenu({ open, onClose, items, cta, pathname, toggleRef, id = 'drawer' }) {
  const overlayRef = useRef(null);
  const sheetRef = useRef(null);
  const panel1Ref = useRef(null);
  const panel2Ref = useRef(null);
  const subTriggerRef = useRef(null);
  const backRef = useRef(null);
  const wasOpen = useRef(false);
  const wasSubOpen = useRef(false);
  // Level 2: which item feeds it, and whether it is showing. The item stays while it slides out.
  const [level2, setLevel2] = useState({ item: null, open: false });
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (!open) setLevel2((s) => ({ ...s, open: false })); // a closed drawer always reopens on level 1
  }
  const sub = level2.item;
  const subOpen = level2.open;

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const closeSub = useCallback(() => setLevel2((s) => ({ ...s, open: false })), []);

  // --- open / close choreography ---------------------------------------------------------------------------------
  useGSAP(
    () => {
      const overlay = overlayRef.current;
      const sheet = sheetRef.current;
      const scrim = overlay?.querySelector('[data-mldm-scrim]');
      const p2 = panel2Ref.current;
      const rows = panel1Ref.current?.querySelectorAll('[data-mldm-row]');
      if (!overlay || !sheet || !scrim) return undefined;
      const reduced = prefersReducedMotion();

      if (open) {
        wasOpen.current = true;
        overlay.style.visibility = 'visible';
        overlay.removeAttribute('inert');
        overlay.setAttribute('aria-hidden', 'false');
        gsap.set(p2, { xPercent: 100 });
        if (reduced) {
          gsap.set(scrim, { opacity: 1 });
          gsap.set(sheet, { clipPath: CLIP_VISIBLE });
          gsap.set(rows, { opacity: 1, x: 0 });
        } else {
          const tl = gsap.timeline({ defaults: { ease, force3D: true } });
          tl.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: duration.ui }, 0);
          tl.fromTo(sheet, { clipPath: CLIP_HIDDEN }, { clipPath: CLIP_VISIBLE, duration: duration.layout }, 0.03);
          tl.fromTo(rows, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: duration.layout, stagger }, duration.ui * 0.5);
        }
        // Focus moves into the drawer once it is visible.
        const first = panel1Ref.current?.querySelector(FOCUSABLE);
        requestAnimationFrame(() => first?.focus({ preventScroll: true }));
      } else if (wasOpen.current) {
        const hide = () => {
          overlay.style.visibility = 'hidden';
          overlay.setAttribute('inert', '');
          overlay.setAttribute('aria-hidden', 'true');
        };
        if (reduced) {
          hide();
        } else {
          const tl = gsap.timeline({ defaults: { ease, force3D: true }, onComplete: hide });
          tl.to(rows, { opacity: 0, duration: duration.hover }, 0);
          tl.to(sheet, { clipPath: CLIP_HIDDEN, duration: duration.ui }, 0.03);
          tl.to(scrim, { opacity: 0, duration: duration.ui }, 0);
        }
      }
      return undefined;
    },
    { dependencies: [open], scope: overlayRef },
  );

  // --- level 2 slide ----------------------------------------------------------------------------------------------
  useGSAP(
    () => {
      const p2 = panel2Ref.current;
      const p1 = panel1Ref.current;
      if (!p2 || !p1) return;
      const reduced = prefersReducedMotion();
      const rows = p2.querySelectorAll('[data-mldm-row]');
      if (subOpen) {
        gsap.to(p2, { xPercent: 0, duration: reduced ? 0 : duration.layout, ease, force3D: true });
        gsap.to(p1, { xPercent: -12, opacity: 0.4, duration: reduced ? 0 : duration.layout, ease });
        if (!reduced) gsap.fromTo(rows, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: duration.layout, stagger, ease, delay: 0.08 });
        backRef.current?.focus({ preventScroll: true });
      } else {
        gsap.to(p2, { xPercent: 100, duration: reduced ? 0 : duration.ui, ease, force3D: true });
        gsap.to(p1, { xPercent: 0, opacity: 1, duration: reduced ? 0 : duration.ui, ease });
        // Back to level 1 with the drawer still open: focus returns to the item that opened level 2.
        if (wasSubOpen.current && open) subTriggerRef.current?.focus({ preventScroll: true });
      }
      wasSubOpen.current = subOpen;
    },
    { dependencies: [subOpen], scope: overlayRef },
  );

  // --- modal behaviour: scroll lock, inert page, focus restore, desktop breakpoint ---------------------------------
  useEffect(() => {
    if (!open) return undefined;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const prevPad = root.style.paddingRight;
    const bar = window.innerWidth - root.clientWidth;
    root.style.overflow = 'hidden';
    if (bar > 0) root.style.paddingRight = `${bar}px`;
    const behind = Array.from(document.querySelectorAll(PAGE_BEHIND));
    behind.forEach((el) => el.setAttribute('inert', ''));
    const toggle = toggleRef?.current ?? null;

    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => mq.matches && onClose();
    mq.addEventListener('change', onMq);

    return () => {
      root.style.overflow = prevOverflow;
      root.style.paddingRight = prevPad;
      behind.forEach((el) => el.removeAttribute('inert'));
      mq.removeEventListener('change', onMq);
      toggle?.focus({ preventScroll: true });
    };
  }, [open, onClose, toggleRef]);

  // --- keyboard: Escape (level 2 first), Tab trap across the header controls + the drawer ------------------------
  useEffect(() => {
    if (!open) return undefined;
    const toggle = toggleRef?.current ?? null;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (subOpen) closeSub();
        else onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const header = toggle?.closest('header');
      const list = [
        ...(header ? header.querySelectorAll(FOCUSABLE) : []),
        ...overlayRef.current.querySelectorAll(FOCUSABLE),
      ].filter((el) => !el.closest('[inert]') && el.getClientRects().length > 0);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !list.includes(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !list.includes(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, subOpen, onClose, closeSub, toggleRef]);

  // Portalled to <body>: the sticky header's backdrop-filter would otherwise become the containing block of this fixed layer.
  return createPortal(
    <div
      ref={overlayRef}
      id={id}
      className="mldm_overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation mobile"
      aria-hidden="true"
      inert
      style={{ visibility: 'hidden' }}
    >
      <button type="button" className="mldm_scrim" data-mldm-scrim tabIndex={-1} aria-hidden="true" onClick={onClose} />
      <div ref={sheetRef} className="mldm_sheet">
        <div ref={panel1Ref} className="mldm_panel" inert={subOpen}>
          <nav aria-label="Navigation mobile">
            <ul className="mldm_list">
              {items.map((item) => (
                <li key={item.label} data-mldm-row className="mldm_row">
                  {item.children ? (
                    <button
                      type="button"
                      className="mldm_link"
                      aria-expanded={subOpen && sub?.label === item.label}
                      aria-controls={`${id}-level2`}
                      onClick={(e) => {
                        subTriggerRef.current = e.currentTarget;
                        setLevel2({ item, open: true });
                      }}
                    >
                      <span>{item.label}</span>
                      <svg aria-hidden="true" width="8" height="14" viewBox="0 0 8 14" className="mldm_chevron">
                        <path d="M1 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                  ) : (
                    <Link href={item.href} className="mldm_link" aria-current={isActive(item.href) ? 'page' : undefined}>
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div data-mldm-row className="mldm_cta">
            <Link href={cta.href} className="btn btn-action">
              {cta.label}
            </Link>
          </div>
        </div>

        <div
          ref={panel2Ref}
          id={`${id}-level2`}
          className="mldm_panel mldm_panel_2"
          role="group"
          aria-label={sub?.label}
          inert={!subOpen}
        >
          {sub && (
            <>
              <button ref={backRef} type="button" className="mldm_back" onClick={closeSub}>
                <svg aria-hidden="true" width="8" height="14" viewBox="0 0 8 14">
                  <path d="M7 1L1 7l6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span>Retour</span>
                <span className="sr-only"> au menu principal</span>
              </button>
              <p data-mldm-row className="mldm_kicker">{sub.label}</p>
              <ul className="mldm_list">
                {sub.children.slice(0, 2).map((c) => (
                  <li key={c.href} data-mldm-row className="mldm_row">
                    <Link href={c.href} className="mldm_link mldm_link_note" aria-current={isActive(c.href) ? 'page' : undefined}>
                      <span>{c.label}</span>
                      {c.note && <small>{c.note}</small>}
                    </Link>
                  </li>
                ))}
              </ul>
              <p data-mldm-row className="mldm_kicker mldm_kicker_sep">Applications mobiles</p>
              <ul className="mldm_grid">
                {sub.children.slice(2).map((c) => (
                  <li key={c.href} data-mldm-row>
                    <Link href={c.href} className="mldm_chip" aria-label={c.label} aria-current={isActive(c.href) ? 'page' : undefined}>
                      {c.label.replace('Mobile ', '')}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
