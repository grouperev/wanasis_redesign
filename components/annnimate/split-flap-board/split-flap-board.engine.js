/*
 * Engine of the Wanasis split-flap value, adapted from vendor/annnimate/split-flap-board (flap mechanics unchanged):
 * the top flap falls edge-on showing the outgoing glyph, the bottom flap lands, bounces and rests; each tile riffles
 * through its own drum (digits / symbols). Changed: no board/sets/arrows - one row that flaps from blank to its value
 * once, triggered by the host; CustomEase removed; durations from lib/motion.
 */
import gsap from 'gsap';
import { duration, stagger as baseStagger } from '@/lib/motion';

const FALL_FRAC = 0.4;
const LAND_FRAC = 0.18;
const BOUNCE_UP_FRAC = 0.16;
const BOUNCE_DOWN_FRAC = 0.2;
const BOUNCE = 32;
const CYCLES = 2;
const RIFFLE_SPEEDUP = 0.35;
const SHADE_PEAK = 0.4;
const GAP_SHADE = 0.3;
const GLINT_PEAK = 0.07;
const DIGITS = ' 0123456789';
const PERIOD = duration.layout - 0.09; // 0.36s: period of the last flap, the one that lands on the target

function drumFor(fromChar, toChar) {
  const ref = toChar !== ' ' ? toChar : fromChar;
  if (/[0-9]/.test(ref)) return DIGITS;
  return ' ' + ref;
}

function riffleSequence(fromChar, toChar) {
  if (fromChar === toChar) return [];
  const drum = drumFor(fromChar, toChar);
  const n = drum.length;
  let i = Math.max(0, drum.indexOf(fromChar));
  const end = Math.max(0, drum.indexOf(toChar));
  if (i === end) return [toChar];
  const seq = [];
  while (i !== end) {
    i = (i + 1) % n;
    seq.push(drum[i]);
  }
  const steps = CYCLES + 1;
  if (seq.length <= steps) return seq;
  const last = seq.length - 1;
  const thinned = [];
  for (let s = 0; s < steps - 1; s += 1) thinned.push(seq[Math.floor((s * last) / (steps - 1))]);
  thinned.push(seq[last]);
  return thinned;
}

function flapPeriod(i, count) {
  const fast = PERIOD / (1 + CYCLES * RIFFLE_SPEEDUP);
  if (count <= 1) return PERIOD;
  return fast + (PERIOD - fast) * (i / (count - 1));
}

/** Flap every tile of `row` from blank to its data-char. Returns a cleanup that restores the final glyphs. */
export function playFlaps(row) {
  const tiles = Array.from(row.querySelectorAll('[data-sfb-tile]')).map((el) => ({
    el,
    target: el.getAttribute('data-char') || ' ',
    current: ' ',
    halfTop: el.querySelector('[data-sfb-half-top]'),
    halfBottom: el.querySelector('[data-sfb-half-bottom]'),
    flapTop: el.querySelector('[data-sfb-flap-top]'),
    flapTopChar: el.querySelector('[data-sfb-flap-top] .sfb_char'),
    flapBottom: el.querySelector('[data-sfb-flap-bottom]'),
    flapBottomChar: el.querySelector('[data-sfb-flap-bottom] .sfb_char'),
    shade: el.querySelector('.sfb_shade'),
    glint: el.querySelector('.sfb_glint'),
  }));

  const setChar = (t, ch) => {
    t.halfTop.textContent = ch;
    t.halfBottom.textContent = ch;
    t.flapTopChar.textContent = ch;
    t.flapBottomChar.textContent = ch;
    t.current = ch;
  };

  const ctx = gsap.context(() => {
    tiles.forEach((t) => {
      setChar(t, ' ');
      gsap.set([t.flapTop, t.flapBottom], { rotateX: 0, transformPerspective: 320, force3D: true });
      gsap.set([t.shade, t.glint], { opacity: 0 });
    });

    const addFlap = (tl, t, outChar, inChar, at, period) => {
      const fall = period * FALL_FRAC;
      const land = period * LAND_FRAC;
      const up = period * BOUNCE_UP_FRAC;
      const down = period * BOUNCE_DOWN_FRAC;
      tl.call(() => {
        t.flapTopChar.textContent = outChar;
        t.halfTop.textContent = inChar;
        t.flapBottomChar.textContent = inChar;
        gsap.set(t.flapTop, { rotateX: 0 });
        gsap.set(t.flapBottom, { rotateX: 90 });
      }, null, at);
      tl.to(t.flapTop, { rotateX: -90, duration: fall, ease: 'power2.in', force3D: true }, at);
      tl.to(t.shade, { opacity: SHADE_PEAK, duration: fall, ease: 'power2.in' }, at);
      tl.call(() => {
        t.halfBottom.textContent = inChar;
        t.flapTopChar.textContent = inChar;
        gsap.set(t.flapTop, { rotateX: 0 });
        t.current = inChar;
      }, null, at + fall);
      tl.to(t.flapBottom, { rotateX: 0, duration: land, ease: 'power1.in', force3D: true }, at + fall);
      tl.to(t.flapBottom, { rotateX: BOUNCE, duration: up, ease: 'power1.out', force3D: true }, at + fall + land);
      tl.to(t.flapBottom, { rotateX: 0, duration: down, ease: 'power1.in', force3D: true }, at + fall + land + up);
      tl.to(t.glint, { opacity: GLINT_PEAK, duration: up, ease: 'power1.out' }, at + fall + land);
      tl.to(t.glint, { opacity: 0, duration: down, ease: 'power1.in' }, at + fall + land + up);
      tl.to(t.shade, { opacity: 0, duration: land, ease: 'power2.out' }, at + fall);
      tl.to(t.shade, { opacity: GAP_SHADE, duration: up, ease: 'power1.out' }, at + fall + land);
      tl.to(t.shade, { opacity: 0, duration: down, ease: 'power1.in' }, at + fall + land + up);
    };

    const master = gsap.timeline();
    tiles.forEach((t, c) => {
      const seq = riffleSequence(' ', t.target);
      const tl = gsap.timeline();
      let prev = ' ';
      let cursor = 0;
      seq.forEach((ch, i) => {
        const period = flapPeriod(i, seq.length);
        addFlap(tl, t, prev, ch, cursor, period);
        cursor += period;
        prev = ch;
      });
      master.add(tl, c * (baseStagger * 2));
    });
  });

  return () => {
    ctx.revert();
    tiles.forEach((t) => {
      setChar(t, t.target);
      gsap.set([t.flapTop, t.flapBottom], { clearProps: 'all' });
      gsap.set([t.shade, t.glint], { clearProps: 'all' });
    });
  };
}
