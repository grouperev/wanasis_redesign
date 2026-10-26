'use client';

import { useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import './accordion.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  // design-system ease-out, cubic-bezier(.22, 1, .36, 1)
  CustomEase.create('wanasisOut', '0.22,1,0.36,1');
}

// 450ms layout tier (design-system motion)
const DURATION = 0.45;

/**
 * AccordionItem - one row of the Annnimate accordion, controlled by its parent so a group can
 * keep a single row open. The panel height tweens; the plus flips to a minus via CSS.
 *
 * Adapted for Wanasis: controlled open state, WAI-ARIA disclosure markup (heading > button,
 * region panel), closed panels are collapsed in the server HTML (no layout shift on hydrate),
 * line-by-line text stagger removed. Reduced motion toggles instantly. A <noscript> rule in the
 * page keeps every panel open when JS is unavailable.
 *
 * @param {boolean} open - Whether the row is open
 * @param {() => void} onToggle - Called when the trigger is activated
 * @param {React.ReactNode} title - Row title (the heading's text)
 * @param {React.ReactNode} [children] - Panel content; omit for a row that has no detail
 * @param {string} [titleLabel] - Optional `title` attribute on the row (dev-visible flag)
 */
export default function AccordionItem({ open, onToggle, title, children, titleLabel }) {
  const uid = useId();
  const panelRef = useRef(null);
  const wasOpen = useRef(open);
  // The inline style is frozen at first render: GSAP owns height/visibility afterwards.
  const [initialOpen] = useState(open);

  useEffect(() => {
    const el = panelRef.current;
    if (!el || wasOpen.current === open) return undefined;
    wasOpen.current = open;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.killTweensOf(el);
    if (open) {
      gsap.set(el, { visibility: 'visible' });
      if (reduce) gsap.set(el, { height: 'auto' });
      else gsap.to(el, { height: 'auto', duration: DURATION, ease: 'wanasisOut' });
    } else if (reduce) {
      gsap.set(el, { height: 0, visibility: 'hidden' });
    } else {
      gsap.to(el, { height: 0, duration: DURATION, ease: 'wanasisOut', onComplete: () => { el.style.visibility = 'hidden'; } });
    }
    return undefined;
  }, [open]);

  if (!children) {
    return (
      <div className="accordion_item" data-anm-accordion-item>
        <h3 className="accordion_heading" title={titleLabel}>
          <span className="accordion_row accordion_row_static">
            <span className="accordion_title">{title}</span>
          </span>
        </h3>
      </div>
    );
  }

  return (
    <div className="accordion_item" data-anm-accordion-item>
      <h3 className="accordion_heading" title={titleLabel}>
        <button
          type="button"
          className="accordion_row accordion_trigger"
          aria-expanded={open}
          aria-controls={`${uid}-panel`}
          id={`${uid}-trigger`}
          onClick={onToggle}
        >
          <span className="accordion_title">{title}</span>
          <svg className="accordion_icon" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
            <path d="M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path className="accordion_icon_v" d="M8 2V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </h3>
      <div
        ref={panelRef}
        id={`${uid}-panel`}
        role="region"
        aria-labelledby={`${uid}-trigger`}
        className="accordion_content"
        style={initialOpen ? undefined : { height: 0, visibility: 'hidden' }}
      >
        <div className="accordion_text">{children}</div>
      </div>
    </div>
  );
}
