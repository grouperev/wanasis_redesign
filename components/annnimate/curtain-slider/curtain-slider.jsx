'use client';

/*
 * Wanasis curtain-slider (Annnimate). Slides share one grid cell (the stage is as tall as the tallest slide: no layout
 * shift), only the active one is visible (so readable and focusable), the others are visibility:hidden. Arrows, keyboard (arrows / Home / End) and drag
 * change slide; the wipe engine is fetched lazily (near viewport) and, without it or under reduced motion, slides just
 * swap. Without JS every slide is shown in turn.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import './curtain-slider.css';

const fmt = (tpl, i, n) => tpl.replace('{i}', String(i)).replace('{n}', String(n));
const SWIPE = 0.12; // share of the stage width to drag before it counts

/**
 * @param {Array<{key: string, background: React.ReactNode, content: React.ReactNode}>} slides
 * @param {{prev: string, next: string, slide: string, status: string, region: string}} labels  slide/status are templates with {i} and {n}
 */
export default function CurtainSlider({ slides, labels, className = '' }) {
  const stageRef = useRef(null);
  const engineRef = useRef(null);
  const loadRef = useRef(null);
  const dragRef = useRef(null);
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const pad = (n) => String(n).padStart(2, '0');

  // Fetch the wipe engine when the slider is about to be seen; nothing is lost if it is slow (plain swap).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion()) return undefined;
    let dead = false;
    const io = new IntersectionObserver(
      (es) => {
        if (!es.some((e) => e.isIntersecting)) return;
        io.disconnect();
        loadRef.current = import('./curtain-slider.engine').then((m) => {
          if (!dead) engineRef.current = m.createCurtain(stage);
        });
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(stage);
    return () => {
      dead = true;
      io.disconnect();
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  const go = useCallback(
    (to, direction) => {
      const next = (to + count) % count;
      if (next === index) return;
      if (!prefersReducedMotion()) engineRef.current?.go(index, next, direction);
      setIndex(next);
    },
    [count, index],
  );

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1, 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1, -1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0, -1); }
    else if (e.key === 'End') { e.preventDefault(); go(count - 1, 1); }
  };

  const onPointerDown = (e) => {
    if (e.target.closest('button, a')) return;
    dragRef.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) < (stageRef.current?.clientWidth ?? 1) * SWIPE || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) go(index + 1, 1);
    else go(index - 1, -1);
  };

  return (
    <div
      className={`cs_wrap${className ? ' ' + className : ''}`}
      role="group"
      aria-roledescription="carrousel"
      aria-label={labels.region}
      data-anm-curtain-slider
    >
      <div
        ref={stageRef}
        className="cs_stage"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { dragRef.current = null; }}
      >
        {slides.map((s, i) => (
          <div
            key={s.key}
            className="cs_layer"
            data-cs-layer
            data-active={i === index ? '' : undefined}
            role="group"
            aria-roledescription="diapositive"
            aria-label={fmt(labels.slide, i + 1, count)}
          >
            <div className="cs_bg" data-cs-bg aria-hidden="true">
              {s.background}
            </div>
            <div className="cs_scrim" aria-hidden="true" />
            <div className="cs_content container-x" data-cs-content>
              {s.content}
            </div>
          </div>
        ))}

        <div className="cs_controls container-x">
          <div className="cs_pill">
            <button type="button" className="cs_arrow" onClick={() => go(index - 1, -1)}>
              <span className="sr-only">{labels.prev}</span>
              <svg aria-hidden width="12" height="14" viewBox="0 0 12 14"><path d="M9 1L3 7l6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
            <button type="button" className="cs_arrow" onClick={() => go(index + 1, 1)}>
              <span className="sr-only">{labels.next}</span>
              <svg aria-hidden width="12" height="14" viewBox="0 0 12 14"><path d="M3 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
          </div>
          <div className="cs_index" aria-hidden="true">
            <span>{pad(index + 1)}</span>
            <span className="cs_progress"><span className="cs_progress_fill" style={{ transform: `scaleX(${(index + 1) / count})` }} /></span>
            <span>{pad(count)}</span>
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{fmt(labels.status, index + 1, count)}</p>
    </div>
  );
}
