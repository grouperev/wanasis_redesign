'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CustomEase } from 'gsap/CustomEase';
import './feature-dialog.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, CustomEase);
  // design-system ease-out, cubic-bezier(.22, 1, .36, 1)
  CustomEase.create('wanasisOut', '0.22,1,0.36,1');
}

const BLUR = 6; // px, page blur behind the sheet
const TINT = 0.5; // ink scrim opacity
const ENTER_DISTANCE = 96;
const EXIT_DISTANCE = 48;
// 450ms layout tier up, the exit is its own quicker leg (300ms UI tier)
const OPEN_DUR = 0.45;
const CLOSE_DUR = 0.3;

const FOCUSABLE = 'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * FeatureDialog - the Annnimate feature-dialog sheet, controlled.
 *
 * The page dims and blurs behind a tall bottom-anchored sheet that rises in with a fast fade.
 * The tile that opens it is the caller's (a grid of tiles shares ONE sheet, so the original
 * tile markup and window.Anm hooks are gone). Focus moves into the sheet, Tab is trapped, Escape
 * and the backdrop close it, and `onClosed` lets the caller return focus to the opener.
 *
 * Wanasis adaptation: ink scrim and hairline surfaces from the tokens; the orange aurora band is
 * dropped (the brand mesh lives only in hero / CTA / footer, design-system) and replaced by a
 * family-tone top band the caller passes as `accent`. Reduced motion: no tween, final state.
 *
 * @param {boolean} open - Whether the sheet is open
 * @param {() => void} onClose - Requests closing (Escape, backdrop, close button)
 * @param {() => void} [onClosed] - Called once the sheet has fully left
 * @param {string} titleId - id of the heading inside `children` (aria-labelledby)
 * @param {string} [closeLabel='Fermer'] - Accessible name of the close button
 * @param {string} [accent] - CSS color (var) of the 4px top band
 */
export default function FeatureDialog({ open, onClose, onClosed, titleId, closeLabel = 'Fermer', accent, children }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const sheetRef = useRef(null);
  const closeRef = useRef(null);
  const [mounted, setMounted] = useState(open);
  const onClosedRef = useRef(onClosed);
  const prevOpen = useRef(false);

  useEffect(() => {
    onClosedRef.current = onClosed;
  }, [onClosed]);

  // Mount the sheet in the render that opens it (derived state, no effect round-trip).
  if (open && !mounted) setMounted(true);

  const { contextSafe } = useGSAP({ scope: modalRef });

  const finishClose = useCallback(() => {
    document.body.style.overflow = '';
    setMounted(false);
    if (onClosedRef.current) onClosedRef.current();
  }, []);

  const play = contextSafe((isOpen) => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    if (!overlay || !modal) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.killTweensOf([overlay, modal]);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (sheetRef.current) sheetRef.current.scrollTop = 0;
      const done = () => closeRef.current?.focus();
      if (reduce) {
        gsap.set(overlay, { '--fdg-a': TINT, '--fdg-blur': BLUR + 'px' });
        gsap.set(modal, { y: 0, autoAlpha: 1 });
        done();
        return;
      }
      gsap.set(modal, { y: ENTER_DISTANCE, autoAlpha: 0 });
      gsap.to(overlay, { '--fdg-a': TINT, '--fdg-blur': BLUR + 'px', duration: OPEN_DUR * 0.6, ease: 'wanasisOut' });
      gsap.to(modal, { y: 0, duration: OPEN_DUR, ease: 'wanasisOut', force3D: true });
      gsap.to(modal, { autoAlpha: 1, duration: OPEN_DUR * 0.45, ease: 'wanasisOut', onComplete: done });
    } else if (reduce) {
      gsap.set(overlay, { '--fdg-a': 0, '--fdg-blur': '0px' });
      gsap.set(modal, { autoAlpha: 0 });
      finishClose();
    } else {
      gsap.to(modal, { y: EXIT_DISTANCE, duration: CLOSE_DUR, ease: 'wanasisOut', force3D: true });
      gsap.to(modal, { autoAlpha: 0, duration: CLOSE_DUR * 0.8, ease: 'wanasisOut' });
      gsap.to(overlay, { '--fdg-a': 0, '--fdg-blur': '0px', duration: CLOSE_DUR, ease: 'wanasisOut', onComplete: finishClose });
    }
  });

  useEffect(() => {
    if (prevOpen.current === open) return;
    prevOpen.current = open;
    if (open) play(true);
    else play(false);
  }, [open, play]);

  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const sheet = sheetRef.current;
      if (!sheet) return;
      const items = sheet.querySelectorAll(FOCUSABLE);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !sheet.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !sheet.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [open, onClose]);

  return (
    <>
      <div ref={overlayRef} className="fdg_overlay" aria-hidden="true" data-open={mounted ? '' : undefined} />
      <div
        ref={modalRef}
        className="fdg_modal"
        data-open={mounted ? '' : undefined}
        onClick={(e) => {
          if (open && sheetRef.current && !sheetRef.current.contains(e.target)) onClose();
        }}
      >
        <div className="fdg_panel">
          <section
            ref={sheetRef}
            className="fdg_sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            inert={!open}
          >
            {accent ? <span aria-hidden="true" className="fdg_accent" style={{ background: accent }} /> : null}
            <button ref={closeRef} type="button" className="fdg_close" aria-label={closeLabel} onClick={onClose}>
              <svg className="fdg_glyph" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <div className="fdg_sheet_inner">{mounted ? children : null}</div>
          </section>
        </div>
      </div>
    </>
  );
}
