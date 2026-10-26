/*
 * Engine of the Wanasis scale-slider, adapted from vendor/annnimate/scale-slider (geometry unchanged): square cards on one
 * baseline whose size is a pure function of x on an exponential ramp, recycled so the strip never ends.
 * Changed: no autoplay and no scroll boost (the strip moves only when asked), always settles on a whole card and reports it
 * (the host shows that card's title as a real link), card count adapts so the head card fits the stage height,
 * CustomEase removed, eases from lib/motion. Returns { next, prev, goTo, destroy }.
 */
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { duration, easeInOut } from '@/lib/motion';

gsap.registerPlugin(Draggable, InertiaPlugin);

const OVERLAP = 1.5; // px: cards overlap their tail neighbour to hide sub-pixel seams
const MIN_SCALE = 0.3;
const DRAG_CLICK_PX = 4;

/**
 * @param {HTMLElement} scene   positioned stage
 * @param {HTMLElement[]} cards square frames, M >= 8
 * @param {{ onSettle?: (headCard: number) => void, direction?: 'rtl'|'ltr' }} opts
 */
export function mountScaleSlider(scene, cards, { onSettle, direction = 'rtl' } = {}) {
  const M = cards.length;
  if (M < 4) return { next() {}, prev() {}, goTo() {}, destroy() {} };
  const RTL = direction !== 'ltr';
  const DRAG_SIGN = RTL ? 1 : -1;

  let viewW = 1;
  let viewH = 1;
  let base = 100;
  let visCount = 5;
  let rampR = 1.35;
  let rampK = 1;
  let rampXv = 0;
  let travel = 0;
  let dragX = 0;
  let dragPerPx = 0.003;
  let navTween = null;
  let draggable = null;
  let resizeTimer = 0;
  let lastDrag = 0;
  let alive = true;

  const phaseNow = () => travel - Math.floor(travel);
  const boundary = (k) => rampXv + rampK * Math.pow(rampR, phaseNow() - k);
  const headCard = () => (((Math.round(travel)) % M) + M) % M;

  // Smallest card count whose largest card (mid-transition) still fits the stage height.
  function computeCount() {
    for (let vc = 3; vc <= M - 1; vc += 1) {
      const r = Math.pow(1 / MIN_SCALE, 1 / (vc - 1));
      const k = viewW / (1 - MIN_SCALE);
      if (k * (r - 1) <= viewH) return vc;
    }
    return M - 1;
  }

  function computeRamp() {
    rampR = Math.pow(1 / MIN_SCALE, 1 / (visCount - 1));
    rampK = viewW / (1 - MIN_SCALE);
    rampXv = -MIN_SCALE * rampK;
  }

  function positionCards() {
    const shift = Math.floor(travel);
    for (let i = 0; i < M; i += 1) {
      const el = cards[i];
      const k = (((i - shift) % M) + M) % M;
      const outer = boundary(k);
      const inner = boundary(k + 1);
      const size = Math.max(outer - inner, 1);
      const w = size + OVERLAP;
      const left = RTL ? inner - OVERLAP : viewW - outer;
      // Size by transform scale off a fixed base frame: the image is rasterised once, only composited.
      el.style.zIndex = String(visCount - k);
      el.style.transform = 'translate3d(' + left.toFixed(1) + 'px,0,0) scale(' + (w / base).toFixed(5) + ')';
    }
  }

  function animateTo(target) {
    if (navTween) navTween.kill();
    const proxy = { t: travel };
    const dur = Math.min(duration.reveal + duration.ui, duration.layout + 0.12 * Math.abs(target - travel));
    navTween = gsap.to(proxy, {
      t: target,
      duration: dur,
      ease: easeInOut,
      onUpdate: () => { travel = proxy.t; positionCards(); },
      onComplete: () => { navTween = null; travel = target; positionCards(); onSettle?.(headCard()); },
    });
  }
  const snap = () => animateTo(Math.round(travel));
  const next = () => animateTo(Math.round(travel) - 1);
  const prev = () => animateTo(Math.round(travel) + 1);
  // Land card i (an index into `cards`) on the head, the shortest way.
  const goTo = (i) => {
    const n = ((i % M) + M) % M;
    animateTo(n + M * Math.round((travel - n) / M));
  };

  function resize() {
    const w = scene.clientWidth;
    const h = scene.clientHeight;
    if (!w || !h) return;
    viewW = w;
    viewH = h;
    visCount = computeCount();
    computeRamp();
    const maxHero = rampK * (rampR - 1);
    base = maxHero + OVERLAP;
    const px = base.toFixed(1) + 'px';
    cards.forEach((c) => { c.style.width = px; c.style.height = px; });
    dragPerPx = 1 / Math.max(120, rampK * (1 - 1 / rampR) * 1.1);
    travel = Math.round(travel); // a resize lands on a whole card
    positionCards();
  }

  const ctx = gsap.context(() => {
    resize(); // places every card while still display:none
    cards.forEach((c) => { c.style.display = 'block'; });

    const proxy = document.createElement('div');
    draggable = Draggable.create(proxy, {
      type: 'x',
      trigger: scene,
      inertia: true,
      allowContextMenu: true,
      dragClickables: true,
      onPress() { lastDrag = 0; },
      onDragStart() { if (navTween) { navTween.kill(); navTween = null; } },
      onDrag() { dragX += this.deltaX; lastDrag = Math.max(lastDrag, Math.abs(this.x - this.startX)); step(); },
      onThrowUpdate() { dragX += this.deltaX; step(); },
      onDragEnd() { if (!this.isThrowing) snap(); },
      onThrowComplete() { snap(); },
    })[0];

    function step() {
      travel += dragX * dragPerPx * DRAG_SIGN;
      dragX = 0;
      positionCards();
    }
  });

  // A card dragged is not a card clicked.
  const onClick = (e) => {
    if (lastDrag > DRAG_CLICK_PX) {
      e.preventDefault();
      e.stopPropagation();
      lastDrag = 0;
    }
  };
  scene.addEventListener('click', onClick, true);

  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => { if (alive) { resize(); onSettle?.(headCard()); } }, 150);
  });
  ro.observe(scene);

  onSettle?.(headCard());

  return {
    next,
    prev,
    goTo,
    destroy() {
      alive = false;
      clearTimeout(resizeTimer);
      ro.disconnect();
      scene.removeEventListener('click', onClick, true);
      if (navTween) navTween.kill();
      draggable?.kill();
      ctx.revert();
      cards.forEach((c) => c.removeAttribute('style'));
    },
  };
}
