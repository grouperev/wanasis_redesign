'use client';

import { useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './image-fly-in.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

// Annnimate "image-fly-in", adapted for Wanasis:
//  - cards are server-rendered nodes (Picture) passed in `cards`, not <img> URLs
//  - the centre copy is `children` (real h1 + text, in the SSR HTML, revealed by the global MotionRoot)
//  - SplitText/CustomEase/ScrollTrigger removed; colours/radius come from the design tokens (css)
//  - the field is decorative (aria-hidden); reduced motion renders a still scatter and never starts the ticker

const EXIT_Z = 400;
const PLATEAU_Z_START = -200;
const PLATEAU_Z_END = -80;
const HOLE_X_MAX = 0.42;
const HOLE_Y_MAX = 0.35;
const HOLE_SOFT_EDGE = 80;
const VELOCITY_LERP = 0.06;
const VELOCITY_DIVISOR = 60;
const PAN_LERP_DUR = 1.2;
const PAN_Y_RATIO = 0.8;

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/**
 * @param {string}  [className]   - extra classes for the root
 * @param {Array}   cards         - { node: ReactNode, aspect: 'square_sm'|'square_lg'|..., hideMobile?: boolean }
 * @param {ReactNode} children    - centre content (kept clear of cards)
 * @param {number}  [duration=14] - full fly-in cycle in seconds at base speed
 * @param {number}  [depth=2000]  - spawn depth in px
 * @param {number}  [speed=1]     - base drift speed multiplier
 * @param {number}  [scrollBoost=2.5] - max scroll-velocity multiplier (0 disables)
 * @param {number}  [pan=32]      - max cursor pan in px (0 disables)
 * @param {number}  [holeBuffer=64] - extra clearance around the measured content
 */
export default function ImageFlyIn({
  className = '',
  cards = [],
  children,
  duration = 14,
  depth = 2000,
  speed = 1,
  scrollBoost = 2.5,
  pan = 32,
  holeBuffer = 64,
}) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const contentRef = useRef(null);
  const cardRefs = useRef([]);

  const addCardRef = useCallback((el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  }, []);

  useGSAP(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const content = contentRef.current;
    const els = cardRefs.current.filter((c) => c.isConnected);

    if (!root || !stage || !els.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    let viewportW = window.innerWidth;
    let viewportH = window.innerHeight;
    let velocityMultiplier = 1;
    let lastScrollY = window.scrollY || 0;
    let running = false;

    const cardStates = [];
    const setters = [];
    const cardHalfW = [];
    const cardHalfH = [];
    let holeXHalfPx = 0;
    let holeYHalfPx = 0;
    const perspectivePx = parseFloat(getComputedStyle(root).perspective) || 1200;

    function measureHole() {
      holeXHalfPx = 0;
      holeYHalfPx = 0;
      if (!content) return;
      const rect = content.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      holeXHalfPx = Math.min(rect.width / 2 + holeBuffer, viewportW * HOLE_X_MAX);
      holeYHalfPx = Math.min(rect.height / 2 + holeBuffer, viewportH * HOLE_Y_MAX);
    }

    function measureCards() {
      els.forEach((card, i) => {
        cardHalfW[i] = card.offsetWidth / 2;
        cardHalfH[i] = card.offsetHeight / 2;
      });
    }

    function randomScatterPosition(halfW, halfH) {
      let x, y, attempts = 0;
      do {
        x = Math.random() - 0.5;
        y = Math.random() - 0.5;
        attempts += 1;
      } while (
        Math.abs(x) * viewportW < holeXHalfPx + halfW &&
        Math.abs(y) * viewportH < holeYHalfPx + halfH &&
        attempts < 24
      );
      return { xFrac: x, yFrac: y };
    }

    function spawnCard(state, progress, i) {
      const pos = randomScatterPosition(cardHalfW[i] || 0, cardHalfH[i] || 0);
      state.xFrac = pos.xFrac;
      state.yFrac = pos.yFrac;
      state.progress = progress || 0;
    }

    // Dim a card per frame in projected space so it never reads on top of the centre copy.
    function holeFadeFactor(i, z, panX, panY) {
      if (!holeXHalfPx && !holeYHalfPx) return 1;
      const s = perspectivePx / (perspectivePx - z);
      const state = cardStates[i];
      const projX = (state.xFrac * viewportW + panX) * s;
      const projY = (state.yFrac * viewportH + panY) * s;
      const sepX = Math.abs(projX) - (holeXHalfPx + (cardHalfW[i] || 0) * s);
      const sepY = Math.abs(projY) - (holeYHalfPx + (cardHalfH[i] || 0) * s);
      return smoothstep(clamp01(Math.max(sepX, sepY) / HOLE_SOFT_EDGE));
    }

    function opacityForZ(z) {
      if (z <= -depth) return 0;
      if (z < PLATEAU_Z_START) return smoothstep(clamp01((z + depth) / (PLATEAU_Z_START + depth)));
      if (z <= PLATEAU_Z_END) return 1;
      if (z < EXIT_Z) return 1 - smoothstep(clamp01((z - PLATEAU_Z_END) / (EXIT_Z - PLATEAU_Z_END)));
      return 0;
    }

    function buildCardStates() {
      cardStates.length = 0;
      setters.length = 0;
      els.forEach((card, i) => {
        const state = { xFrac: 0, yFrac: 0, progress: i / els.length };
        cardStates.push(state);
        spawnCard(state, i / els.length, i);
        setters.push({
          x: gsap.quickSetter(card, 'x', 'px'),
          y: gsap.quickSetter(card, 'y', 'px'),
          z: gsap.quickSetter(card, 'z', 'px'),
          opacity: gsap.quickSetter(card, 'opacity'),
        });
      });
    }

    let quickPanX, quickPanY;

    function tick() {
      if (!running) return;
      const dt = gsap.ticker.deltaRatio(60) / 60;
      const rate = (speed * velocityMultiplier) / duration;
      velocityMultiplier += (1 - velocityMultiplier) * VELOCITY_LERP;
      const totalTravel = EXIT_Z + depth;
      const panX = quickPanX ? Number(gsap.getProperty(stage, 'x')) || 0 : 0;
      const panY = quickPanY ? Number(gsap.getProperty(stage, 'y')) || 0 : 0;

      for (let i = 0; i < cardStates.length; i++) {
        const state = cardStates[i];
        state.progress += rate * dt;
        if (state.progress >= 1) spawnCard(state, state.progress - 1, i);
        const z = -depth + state.progress * totalTravel;
        setters[i].x(state.xFrac * viewportW);
        setters[i].y(state.yFrac * viewportH);
        setters[i].z(z);
        setters[i].opacity(opacityForZ(z) * holeFadeFactor(i, z, panX, panY));
      }
    }

    function startTicker() {
      if (running) return;
      running = true;
      gsap.ticker.add(tick);
    }

    function stopTicker() {
      running = false;
      gsap.ticker.remove(tick);
    }

    function onPointerMove(e) {
      const rect = root.getBoundingClientRect();
      quickPanX((((e.clientX - rect.left) / rect.width) * 2 - 1) * pan);
      quickPanY((((e.clientY - rect.top) / rect.height) * 2 - 1) * pan * PAN_Y_RATIO);
    }

    function onPointerLeave() {
      quickPanX(0);
      quickPanY(0);
    }

    if (!isCoarsePointer && !reduced && pan > 0) {
      quickPanX = gsap.quickTo(stage, 'x', { duration: PAN_LERP_DUR, ease: 'power3.out' });
      quickPanY = gsap.quickTo(stage, 'y', { duration: PAN_LERP_DUR, ease: 'power3.out' });
      root.addEventListener('pointermove', onPointerMove);
      root.addEventListener('pointerleave', onPointerLeave);
    }

    function onScroll() {
      const y = window.scrollY || 0;
      const dlt = Math.abs(y - lastScrollY);
      lastScrollY = y;
      if (scrollBoost > 0) {
        const boost = 1 + Math.min(dlt / VELOCITY_DIVISOR, 1) * (scrollBoost - 1);
        velocityMultiplier = Math.max(velocityMultiplier, boost);
      }
    }

    function layout() {
      viewportW = window.innerWidth;
      viewportH = window.innerHeight;
      measureHole();
      measureCards();
      if (reduced) placeStill();
    }

    function placeStill() {
      els.forEach((card, i) => {
        spawnCard(cardStates[i], 0, i);
        gsap.set(card, { x: cardStates[i].xFrac * viewportW, y: cardStates[i].yFrac * viewportH, z: -200, opacity: 0.9 });
      });
    }

    let resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 150);
    }

    let io = null;
    let visible = true;
    function onVisibilityChange() {
      if (document.hidden) stopTicker();
      else if (visible && !reduced) startTicker();
    }

    gsap.set(els, { force3D: true });
    measureHole();
    measureCards();
    buildCardStates();

    if (reduced) {
      placeStill();
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
      io = new IntersectionObserver((entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible && !document.hidden) startTicker();
        else stopTicker();
      });
      io.observe(root);
      document.addEventListener('visibilitychange', onVisibilityChange);
      startTicker();
    }
    window.addEventListener('resize', onResize);

    return () => {
      stopTicker();
      clearTimeout(resizeTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (io) io.disconnect();
    };
  }, {
    scope: rootRef,
    dependencies: [cards.length, duration, depth, speed, scrollBoost, pan, holeBuffer],
  });

  return (
    <section ref={rootRef} className={`ifi_section on-dark${className ? ' ' + className : ''}`} data-anm-image-fly-in>
      <div ref={stageRef} className="ifi_stage" data-anm-ifi-stage aria-hidden="true">
        {cards.map((c, i) => (
          <div
            key={i}
            ref={addCardRef}
            className={`ifi_card ifi_card_${c.aspect}${c.hideMobile ? ' ifi_card_hide_mobile' : ''}`}
            data-anm-ifi-card
          >
            {c.node}
          </div>
        ))}
      </div>
      <div ref={contentRef} className="ifi_content" data-anm-ifi-content>
        {children}
      </div>
    </section>
  );
}
