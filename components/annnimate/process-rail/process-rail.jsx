'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';
import './process-rail.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin, DrawSVGPlugin, CustomEase);
  // design-system ease-out, cubic-bezier(.22, 1, .36, 1)
  CustomEase.create('wanasisOut', '0.22,1,0.36,1');
}

const EASE = 'wanasisOut';
// 300ms UI tier (design-system motion)
const CARD_DUR = 0.3;
// a step not yet reached; reached steps are fully opaque (contrast stays AA)
const UPCOMING = 0.6;
const MOBILE_READ = '60%';

/**
 * ProcessRail - steps along a line. As the rail scrolls through the viewport a small bead rides
 * the line, draws it up to itself, and each step brightens when the bead reaches it.
 *
 * Adapted from the Annnimate starter pack for Wanasis: no pinned track (sticky=false only, so no
 * layout is reserved and CLS is 0), no step images, no digit roll, tokens instead of literals.
 * Without JS, or under prefers-reduced-motion, every step is readable at full opacity, the line is
 * drawn in full and the bead is hidden.
 *
 * @param {string} [className=''] - Extra classes on the root
 * @param {Array<{num?: string, title: string, tag?: string}>} steps - The steps, in order
 * @param {number} [scrub=0.6] - Scrub catch-up in seconds
 * @param {number} [beadSize=10] - Bead diameter, px
 * @param {string} [label] - Accessible name of the list
 */
export default function ProcessRail({ className = '', steps, scrub = 0.6, beadSize = 10, label }) {
  const containerRef = useRef(null);
  const railRef = useRef(null);
  const beadRef = useRef(null);
  const desktopPathRef = useRef(null);
  const desktopGhostRef = useRef(null);
  const mobilePathRef = useRef(null);
  const mobileGhostRef = useRef(null);
  const stepRefs = useRef([]);

  useGSAP(() => {
    const container = containerRef.current;
    const rail = railRef.current;
    const bead = beadRef.current;
    const stepEls = stepRefs.current.filter(Boolean);
    const paths = [desktopPathRef.current, mobilePathRef.current].filter(Boolean);
    if (!container || !rail || !bead || !paths.length || !stepEls.length) return;

    const scrubValue = scrub > 0 ? scrub : true;
    const ghosts = new Map([
      [desktopPathRef.current, desktopGhostRef.current],
      [mobilePathRef.current, mobileGhostRef.current],
    ]);

    let tl = null;
    let current = null;
    let active = -1;
    let resizeTimer = null;
    const mm = gsap.matchMedia();

    const anchorAt = (i) => (current && current.anchors ? current.anchors[i] : 0);

    // Fits the line to the steps and measures where each step sits on it (path units are pixels).
    function layout() {
      if (!current) return;
      const path = current.path;
      const svg = path.ownerSVGElement;
      const rr = rail.getBoundingClientRect();
      const sr = svg.getBoundingClientRect();
      const w = Math.max(1, Math.round(sr.width));
      const h = Math.max(1, Math.round(sr.height));
      const n = stepEls.length;
      let d;
      if (current.isMobile) {
        const ys = stepEls.map((el) => {
          const r = (el.querySelector('[data-prl-num]') || el).getBoundingClientRect();
          return Math.round(r.top - sr.top + r.height / 2);
        });
        d = 'M ' + w / 2 + ' ' + ys[0] + ' L ' + w / 2 + ' ' + ys[n - 1];
        current.anchors = stepEls.map((el, i) => (n > 1 ? i / (n - 1) : 0.5));
      } else {
        d = 'M 0 ' + h / 2 + ' L ' + w + ' ' + h / 2;
        current.anchors = stepEls.map((el) => {
          const r = el.getBoundingClientRect();
          return gsap.utils.clamp(0, 1, (r.left + r.width / 2 - sr.left) / w);
        });
      }
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
      if (path.getAttribute('d') !== d) {
        path.setAttribute('d', d);
        const ghost = ghosts.get(path);
        if (ghost) ghost.setAttribute('d', d);
      }
      const raw = MotionPathPlugin.getRawPath(path);
      MotionPathPlugin.cacheRawPathMeasurements(raw);
      const toRail = (pt) => ({ x: sr.left - rr.left + pt.x, y: sr.top - rr.top + pt.y });
      current.pts = stepEls.map((el, i) => toRail(MotionPathPlugin.getPositionOnPath(raw, anchorAt(i))));
      current.end = toRail(MotionPathPlugin.getPositionOnPath(raw, 1));
    }

    function stepIndexAt(progress) {
      if (!tl || progress <= 0) return -1;
      const t = progress * tl.duration();
      let idx = -1;
      stepEls.forEach((el, i) => { if (t >= anchorAt(i) - 0.0001) idx = i; });
      return idx;
    }

    function setActive(i) {
      if (i === active) return;
      active = i;
      stepEls.forEach((el, k) => {
        if (k === i) el.setAttribute('aria-current', 'step');
        else el.removeAttribute('aria-current');
        gsap.to(el, { opacity: k <= i ? 1 : UPCOMING, duration: CARD_DUR, ease: EASE, overwrite: true });
      });
    }

    function makeTrigger() {
      const base = {
        scrub: scrubValue,
        invalidateOnRefresh: true,
        onRefreshInit: layout,
        onUpdate: (self) => setActive(stepIndexAt(self.progress)),
      };
      if (current.isMobile) {
        return Object.assign(base, {
          trigger: rail,
          start: () => 'clamp(top+=' + Math.round(current.pts[0].y) + ' ' + MOBILE_READ + ')',
          end: () => 'clamp(top+=' + Math.round(current.pts[current.pts.length - 1].y) + ' ' + MOBILE_READ + ')',
        });
      }
      return Object.assign(base, { trigger: container, start: 'top 80%', end: 'bottom 30%' });
    }

    function buildTimeline() {
      const path = current.path;
      stepEls.forEach((el) => gsap.set(el, { opacity: UPCOMING }));
      gsap.set(bead, { opacity: 1 });
      const t = gsap.timeline({ defaults: { ease: EASE, force3D: true }, scrollTrigger: makeTrigger() });
      t.to(bead, {
        motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: false, start: 0, end: 1 },
        ease: 'none',
        duration: 1,
        immediateRender: true,
      }, 0);
      t.fromTo(path, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', ease: 'none', force3D: false, duration: 1 }, 0);
      return t;
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { layout(); ScrollTrigger.refresh(); }, 150);
    }
    const onRefreshed = () => { if (current) layout(); };

    window.addEventListener('resize', onResize);
    ScrollTrigger.addEventListener('refresh', onRefreshed);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);

    // Reduced motion: nothing is built, the static markup is the final state.
    mm.add({
      isMobile: '(max-width: 767px)',
      isDesktop: '(min-width: 768px)',
      isFull: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      if (!context.conditions.isFull) return undefined;
      const isMobile = !!context.conditions.isMobile;
      current = { isMobile, path: (isMobile ? mobilePathRef.current : desktopPathRef.current) || paths[0], pts: [] };
      layout();
      tl = buildTimeline();
      return () => {
        if (tl) {
          if (tl.scrollTrigger) tl.scrollTrigger.kill(true);
          tl.kill();
          tl = null;
        }
        gsap.set(bead, { clearProps: 'transform,opacity' });
        paths.forEach((p) => gsap.set(p, { clearProps: 'strokeDasharray,strokeDashoffset' }));
        gsap.set(stepEls, { clearProps: 'opacity' });
        stepEls.forEach((el) => el.removeAttribute('aria-current'));
        active = -1;
        current = null;
      };
    });

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      ScrollTrigger.removeEventListener('refresh', onRefreshed);
      mm.revert();
    };
  }, { scope: containerRef, revertOnUpdate: true, dependencies: [scrub, beadSize, steps] });

  return (
    <div
      ref={containerRef}
      className={`prl_wrap ${className}`.trim()}
      style={{ '--prl-bead': beadSize + 'px' }}
      data-anm-process-rail
    >
      <div ref={railRef} className="prl_rail">
        <svg className="prl_svg prl_svg_desktop" viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path ref={desktopGhostRef} className="prl_path_ghost" d="M 0 12 L 1200 12" />
          <path ref={desktopPathRef} className="prl_path" d="M 0 12 L 1200 12" />
        </svg>
        <svg className="prl_svg prl_svg_mobile" viewBox="0 0 72 560" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path ref={mobileGhostRef} className="prl_path_ghost" d="M 36 16 L 36 544" />
          <path ref={mobilePathRef} className="prl_path" d="M 36 16 L 36 544" />
        </svg>
        <span ref={beadRef} className="prl_bead" aria-hidden="true" />
        <ol className="prl_steps" aria-label={label}>
          {steps.map((step, i) => (
            <li key={step.title} ref={(el) => { stepRefs.current[i] = el; }} className="prl_step">
              <span className="prl_step_num" data-prl-num aria-hidden="true">
                {step.num || String(i + 1).padStart(2, '0')}
              </span>
              <span className="prl_step_title">{step.title}</span>
              {step.tag ? <span className="prl_step_tag">{step.tag}</span> : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
