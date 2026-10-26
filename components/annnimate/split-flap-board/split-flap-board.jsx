'use client';

/*
 * Wanasis split-flap value (Annnimate split-flap-board, reduced to one row). The HTML already shows the final value on
 * tiles; once the row scrolls into view the flap engine (lazy) flaps it from blank to that value, once. The tiles are
 * decorative (aria-hidden): the host keeps the real value as text. Reduced motion: engine never loads, final state stays.
 */
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import './split-flap-board.css';

const MIX_MAX = 60; // % of teal at the last tile: keeps every glyph >= 3:1 on white (large text)

export default function SplitFlapValue({ value, className = '' }) {
  const rowRef = useRef(null);
  const chars = Array.from(value);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || prefersReducedMotion()) return undefined;
    let dead = false;
    let stop = null;
    let engine = null;
    const load = () => (engine ??= import('./split-flap-board.engine'));

    // Fetch the engine shortly before the row is on screen, flap when it really is.
    const near = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        near.disconnect();
        load();
      }
    }, { rootMargin: '800px 0px' });
    const seen = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        seen.disconnect();
        load().then((m) => {
          if (!dead) stop = m.playFlaps(row);
        });
      }
    }, { threshold: 0.6 });
    near.observe(row);
    seen.observe(row);

    return () => {
      dead = true;
      near.disconnect();
      seen.disconnect();
      stop?.();
    };
  }, [value]);

  return (
    <span ref={rowRef} className={`sfb_row${className ? ' ' + className : ''}`} aria-hidden="true" data-anm-split-flap-board>
      {chars.map((ch, i) => (
        <span
          key={i}
          className={`sfb_tile${/[0-9]/.test(ch) ? '' : ' sfb_tile_narrow'}`}
          data-sfb-tile
          data-char={ch}
          style={{ '--sfb-mix': `${chars.length > 1 ? Math.round((i / (chars.length - 1)) * MIX_MAX) : 0}%` }}
        >
          <span className="sfb_half sfb_half_top">
            <span className="sfb_char sfb_char_top" data-sfb-half-top>{ch}</span>
          </span>
          <span className="sfb_half sfb_half_bottom">
            <span className="sfb_char sfb_char_bottom" data-sfb-half-bottom>{ch}</span>
            <span className="sfb_shade" />
          </span>
          <span className="sfb_flap sfb_flap_top" data-sfb-flap-top>
            <span className="sfb_char sfb_char_top">{ch}</span>
          </span>
          <span className="sfb_flap sfb_flap_bottom" data-sfb-flap-bottom>
            <span className="sfb_char sfb_char_bottom">{ch}</span>
            <span className="sfb_glint" />
          </span>
        </span>
      ))}
    </span>
  );
}
