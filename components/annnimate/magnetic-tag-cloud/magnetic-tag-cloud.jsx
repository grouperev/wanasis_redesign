'use client';

/*
 * Wanasis magnetic-tag-cloud (Annnimate). The markup below is the whole component without JS: a centred, wrapping list
 * of links (the former static ModuleCloud). On a fine pointer with motion allowed, the physics engine is fetched
 * lazily (once the cloud is near the viewport) and lifts the tags out of the flow; touch and reduced motion keep the list.
 */
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { canAnimateWithCursor } from '@/lib/motion';
import './magnetic-tag-cloud.css';

/**
 * @param {Array<{label: string, href: string, className?: string, chip?: string}>} tags
 */
export default function MagneticTagCloud({ tags, className = '' }) {
  const wrapRef = useRef(null);
  const cloudRef = useRef(null);
  const tagRefs = useRef([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cloud = cloudRef.current;
    if (!wrap || !cloud) return undefined;
    const tagEls = tagRefs.current.slice(0, tags.length).filter(Boolean);
    let unmount = null;
    let dead = false;
    let io = null;

    const start = () => {
      if (dead || unmount || !canAnimateWithCursor() || !window.matchMedia('(min-width: 768px)').matches) return;
      import('./magnetic-tag-cloud.engine').then((m) => {
        if (dead || unmount) return;
        unmount = m.mountTagCloud(wrap, cloud, tagEls, { maxRows: 4, hoverRadius: 90, spin: 1 });
      });
    };

    // Load GSAP/Draggable only when the cloud is about to be seen.
    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: '400px 0px' },
    );
    io.observe(wrap);

    return () => {
      dead = true;
      io?.disconnect();
      unmount?.();
    };
  }, [tags]);

  return (
    <div ref={wrapRef} className={`mtc_wrap${className ? ' ' + className : ''}`} data-anm-magnetic-tag-cloud>
      <div className="mtc_cloud" ref={cloudRef} data-anm-mtc-cloud>
        <ul className="mtc_list" role="list">
          {tags.map((tag, i) => (
            <li key={tag.href}>
              <Link
                href={tag.href}
                className={`mtc_tag ${tag.className ?? ''}`}
                ref={(el) => {
                  tagRefs.current[i] = el;
                }}
                data-anm-mtc-tag
              >
                {tag.chip && <span aria-hidden className="mtc_chip" style={{ backgroundColor: tag.chip }} />}
                {tag.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
