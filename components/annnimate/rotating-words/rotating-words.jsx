'use client';

/*
 * Wanasis rotating-words (Annnimate). Server HTML = the resting word only, in a box wide enough for the longest word
 * (so nothing moves when the wheel spins). The 3D wheel engine is fetched after load and plays once, landing on the
 * last word. Reduced motion: the engine is never fetched. The wheel is decorative: callers expose the full text to
 * assistive tech themselves.
 */
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import './rotating-words.css';

/**
 * @param {string[]} words  the last one is where the wheel lands (and what the HTML shows)
 */
export default function RotatingWords({ words, className = '' }) {
  const rootRef = useRef(null);
  const key = words.join('\n');

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let dead = false;
    let unmount = null;
    import('./rotating-words.engine').then((m) => {
      if (!dead && rootRef.current) unmount = m.mountRotatingWords(rootRef.current);
    });
    return () => {
      dead = true;
      unmount?.();
    };
  }, [key]);

  return (
    <span ref={rootRef} className={`rw_wheel${className ? ' ' + className : ''}`} data-anm-rotating-words>
      <span className="rw_sizer" aria-hidden="true">
        {words.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </span>
      <span className="rw_list" data-rw-list aria-hidden="true">
        {words.map((w, i) => (
          <span key={w} className="rw_item" data-last={i === words.length - 1 ? '' : undefined}>
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
