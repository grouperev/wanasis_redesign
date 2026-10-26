'use client';

/*
 * Wanasis scale-slider (Annnimate) as an overlay on the static news rail. The host keeps the rail in the flow (so the
 * section height never changes); this layer is mounted only when motion is allowed, fetches GSAP/Draggable/Inertia when
 * near the viewport, and calls onReady() once the cards are placed, which is when the host hides the rail.
 * The pointer can drag/throw the strip and click a card (a link); everyone else uses the caption link below it, the arrows
 * or the Left/Right keys. Cards are decorative duplicates (aria-hidden, not tabbable): the caption is the real link.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import './scale-slider.css';

const MIN_CARDS = 12;

/**
 * @param {Array<{key: string, href: string, title: string, cover: React.ReactNode, meta: React.ReactNode}>} posts
 * @param {{region: string, prev: string, next: string, status: string}} labels  status is a template with {i} and {n}
 * @param {() => void} onReady
 */
export default function ScaleSlider({ posts, labels, onReady, className = '' }) {
  const sceneRef = useRef(null);
  const cardRefs = useRef([]);
  const apiRef = useRef(null);
  const readyRef = useRef(onReady);
  const [head, setHead] = useState(0);
  const [ready, setReady] = useState(false);
  const n = posts.length;
  const total = n * Math.ceil(MIN_CARDS / n);
  // Card c shows post (-c mod n): stepping "next" lands on the next post (see the engine).
  const postOf = useMemo(() => (c) => (((-c) % n) + n) % n, [n]);

  useEffect(() => {
    readyRef.current = onReady;
  });

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    let dead = false;
    let io = null;
    const mount = () => {
      import('./scale-slider.engine').then((m) => {
        if (dead) return;
        const cards = cardRefs.current.slice(0, total).filter(Boolean);
        apiRef.current = m.mountScaleSlider(scene, cards, {
          onSettle: (c) => setHead(postOf(c)),
        });
        setReady(true);
        readyRef.current?.();
      });
    };
    io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          io.disconnect();
          mount();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(scene);
    return () => {
      dead = true;
      io?.disconnect();
      apiRef.current?.destroy();
      apiRef.current = null;
    };
  }, [total, postOf]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); apiRef.current?.next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); apiRef.current?.prev(); }
  };

  const current = posts[head] ?? posts[0];

  return (
    <div
      className={`scs_wrap container-x${className ? ' ' + className : ''}`}
      data-ready={ready ? '' : undefined}
      role="group"
      aria-roledescription="carrousel"
      aria-label={labels.region}
      data-anm-scale-slider
    >
      <div ref={sceneRef} className="scs_scene" tabIndex={ready ? 0 : -1} onKeyDown={onKeyDown}>
        {Array.from({ length: total }, (_, c) => {
          const p = posts[postOf(c)];
          return (
            <Link
              key={c}
              href={p.href}
              ref={(el) => { cardRefs.current[c] = el; }}
              className="scs_card"
              tabIndex={-1}
              aria-hidden="true"
              draggable={false}
            >
              {p.cover}
            </Link>
          );
        })}
      </div>
      <div className="scs_caption">
        <div className="scs_caption_text">
          <p className="scs_meta">{current.meta}</p>
          <h3 className="scs_title">
            <Link href={current.href}>{current.title}</Link>
          </h3>
        </div>
        <div className="scs_pill">
          <button type="button" className="scs_arrow" onClick={() => apiRef.current?.prev()}>
            <span className="sr-only">{labels.prev}</span>
            <svg aria-hidden width="12" height="14" viewBox="0 0 12 14"><path d="M9 1L3 7l6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
          <button type="button" className="scs_arrow" onClick={() => apiRef.current?.next()}>
            <span className="sr-only">{labels.next}</span>
            <svg aria-hidden width="12" height="14" viewBox="0 0 12 14"><path d="M3 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {ready ? labels.status.replace('{i}', String(head + 1)).replace('{n}', String(n)) : ''}
      </p>
    </div>
  );
}
