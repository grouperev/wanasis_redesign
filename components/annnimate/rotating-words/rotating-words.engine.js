/*
 * Engine of the Wanasis rotating-words, adapted from vendor/annnimate/rotating-words.
 * Kept: the 3D drum (items on a cylinder, neighbours fade), the spin that settles on the last word.
 * Changed: plays once on load (no scrub, no dots), starts from the resting word so it matches the SSR text, line-height
 * box stays one line (the drum overflows visually only), CustomEase/weight/blur removed, eases from lib/motion.
 */
import gsap from 'gsap';
import { duration, ease, easeInOut, easeSpin } from '@/lib/motion';

const STEP = 18; // degrees between neighbours
const ITEM_GAP = 1.5; // item heights between neighbours along the drum surface
const PERSPECTIVE = 4; // x radius
const DIM = 0.14;
const BLUR_FROM = 0.2;

export function mountRotatingWords(root, { delay = 0.5 } = {}) {
  const list = root.querySelector('[data-rw-list]');
  const items = list ? Array.from(list.children) : [];
  if (items.length < 2) return () => {};
  const last = items.length - 1;
  const drum = { p: last };
  let radius = 0;
  let alive = true;
  let resizeTimer = 0;
  let lastWidth = root.clientWidth;

  function layout() {
    const itemH = items[0].offsetHeight || 1;
    radius = (itemH * ITEM_GAP) / (2 * Math.sin((STEP * Math.PI) / 360));
    list.style.perspective = Math.round(radius * PERSPECTIVE) + 'px';
    render();
  }

  function render() {
    const p = drum.p;
    for (let i = 0; i < items.length; i++) {
      const el = items[i];
      const d = i - p;
      const a = d * STEP;
      if (Math.abs(a) >= 90) {
        el.style.visibility = 'hidden';
        continue;
      }
      const near = Math.max(0, 1 - Math.abs(d));
      const fade = 1 - Math.abs(a) / 90;
      el.style.visibility = 'visible';
      el.style.transform = 'translateY(-50%) translateZ(' + -radius + 'px) rotateX(' + -a + 'deg) translateZ(' + radius + 'px)';
      el.style.opacity = String(DIM * fade + (1 - DIM) * near);
      const depth = Math.max(0, (Math.abs(a) / 90 - BLUR_FROM) / (1 - BLUR_FROM));
      const b = Math.round(4 * depth * depth * 2) / 2;
      el.style.filter = b > 0 ? 'blur(' + b + 'px)' : '';
    }
  }

  const ctx = gsap.context(() => {});
  const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  ready.then(() => {
    if (!alive) return;
    ctx.add(() => {
      root.classList.add('rw_built');
      layout();
      // Wind back to the first word, then spin through the list and settle on the last: one continuous move from the
      // SSR state, played once.
      const tl = gsap.timeline({ delay });
      tl.to(drum, { p: 0, duration: duration.layout, ease: easeInOut, onUpdate: render });
      tl.to(drum, { p: last + 0.15, duration: duration.reveal * 2, ease: easeSpin, onUpdate: render });
      tl.to(drum, { p: last, duration: duration.layout, ease, onUpdate: render });
    });
  });

  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (root.clientWidth === lastWidth) return;
      lastWidth = root.clientWidth;
      if (root.classList.contains('rw_built')) layout();
    }, 150);
  });
  ro.observe(root);

  return () => {
    alive = false;
    clearTimeout(resizeTimer);
    ro.disconnect();
    ctx.revert();
    root.classList.remove('rw_built');
    items.forEach((el) => el.removeAttribute('style'));
    list.removeAttribute('style');
  };
}
