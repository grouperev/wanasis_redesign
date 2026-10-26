/*
 * Engine of the Wanasis curtain-slider, adapted from vendor/annnimate/curtain-slider.
 * Kept: the outgoing slide leaves through a staggered wipe over the incoming one, which settles from a slight zoom.
 * Changed: slides are real DOM (accessible quotes, not 12 image strips), so the wipe is ONE clip-path polygon with a
 * ragged edge whose bands are staggered; text rises in. CustomEase removed; durations and eases from lib/motion.
 */
import gsap from 'gsap';
import { duration, ease, easeInOut } from '@/lib/motion';

const BANDS = 6;
const SPREAD = 0.7; // how far the bands are staggered along the wipe, 0 = straight edge
const ZOOM_FROM = 1.06;

const clamp01 = (v) => Math.max(0, Math.min(1, v));

function polygon(t, dir) {
  const anchor = dir > 0 ? 100 : 0;
  const pts = [anchor + '% 0%', anchor + '% 100%'];
  for (let k = BANDS; k >= 0; k -= 1) {
    const p = clamp01(t * (1 + SPREAD) - (k / BANDS) * SPREAD);
    const x = dir > 0 ? p * 100 : 100 - p * 100;
    pts.push(x.toFixed(2) + '% ' + ((k / BANDS) * 100).toFixed(2) + '%');
  }
  return 'polygon(' + pts.join(',') + ')';
}

export function createCurtain(stage) {
  const layers = Array.from(stage.querySelectorAll('[data-cs-layer]'));
  let tl = null;
  let pair = null;

  function finish() {
    if (!tl) return;
    tl.kill();
    tl = null;
    if (pair) {
      const { out, inn } = pair;
      out.style.visibility = '';
      out.style.zIndex = '';
      out.style.clipPath = '';
      inn.style.visibility = '';
      inn.style.zIndex = '';
      gsap.set([inn.querySelector('[data-cs-bg]'), inn.querySelector('[data-cs-content]')], { clearProps: 'all' });
    }
    pair = null;
  }

  /** direction: 1 = next (wipes left to right), -1 = previous. */
  function go(from, to, direction) {
    if (from === to || !layers[from] || !layers[to]) return;
    finish(); // a transition in flight is snapped to its end first
    const out = layers[from];
    const inn = layers[to];
    pair = { out, inn };
    out.style.visibility = 'visible';
    out.style.zIndex = '2';
    inn.style.visibility = 'visible';
    inn.style.zIndex = '1';
    const bg = inn.querySelector('[data-cs-bg]');
    const content = inn.querySelector('[data-cs-content]');
    const proxy = { t: 0 };
    out.style.clipPath = polygon(0, direction);
    tl = gsap.timeline({ onComplete: finish });
    tl.to(proxy, { t: 1, duration: duration.reveal, ease: easeInOut, onUpdate: () => { out.style.clipPath = polygon(proxy.t, direction); } }, 0);
    tl.fromTo(bg, { scale: ZOOM_FROM }, { scale: 1, duration: duration.reveal + duration.hover, ease, force3D: true }, 0);
    tl.fromTo(content, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: duration.layout, ease }, duration.ui * 0.8);
  }

  return {
    go,
    destroy() {
      finish();
    },
  };
}
