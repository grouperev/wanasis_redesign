# W1 — Global motion + Home (builder A)

Owns: `lib/motion.ts`, `components/motion/**`, `components/site/**`, `components/home/**`, `app/page.tsx`,
`app/layout.tsx` (only to mount MotionRoot), and `components/annnimate/{multi-level-drawer-menu,text-reveal,
rotating-words,dual-scramble,elastic-divider,magnetic-tag-cloud,split-flap-board,curtain-slider,scale-slider}`.

1. **`lib/motion.ts`** — single source: `ease` (`"power3.out"` ≈ cubic-bezier(.22,1,.36,1)), durations
   `{ hover: .15, ui: .3, layout: .45, reveal: .8 }`, `stagger: .06`, `prefersReducedMotion()` helper,
   brand colors for scramble (`#1CB1BD` → ink `#0B1F2E`, on dark → white).
2. **`components/motion/MotionRoot.tsx`** (client, mounted once in layout): on route change finds
   `h1[data-reveal]` → word-by-word reveal, total ≈ 0.8s, opacity/translateY only; the text is already painted from
   SSR (start at opacity .001→1 is NOT allowed for LCP — animate `y` 0.4em→0 + opacity .2→1 on words, or clip-path).
   `[data-scramble]` → dual-scramble on scroll-in, once. Use the Annnimate implementations (text-reveal,
   dual-scramble) as the engine; reduced motion → no-op. Cleanup on unmount.
3. **Header** — keep the desktop inline nav + Solutions disclosure exactly as is. Replace the ≤1024px drawer with
   `multi-level-drawer-menu`: panel 1 = NAV; "Solutions" opens panel 2 = Fusion ERP / Life HIS / Applications
   mobiles (View · Link · Pick · Ship). Dim layer `#00324B` at 60%. Focus trap, Escape, restore focus, body lock.
4. **`elastic-divider`** → `components/motion/Divider.tsx` (1px teal line, cursor-reactive only, static on touch /
   reduced motion). Use it between Mission and Products, and above the news rail.
5. **Home** (`app/page.tsx` + `components/home/*`):
   - Hero: `h1 data-reveal`; the "ERP pour …" line becomes `rotating-words` with the list already in page.tsx
     (`WHEEL`), plays once on load and lands on "votre activité"; SSR shows "votre activité"; `aria-label` keeps the
     full list. The hero image stays an AssetSlot "H1 …" (Phase 4 swaps it).
   - ClientStrip: CSS marquee (no JS) duplicating the list with `aria-hidden` on the clone, ~60s loop, pause on
     hover/focus-within, static scroll row under reduced motion.
   - Product cards: put `data-scramble` on a visually-hidden-safe span with the product name next to the badge
     image (badge img keeps `alt`; the scramble span is `aria-hidden` to avoid double reading). Diagrams stay slots.
   - ModuleCloud → `magnetic-tag-cloud` with the same tags/colors/links; touch + reduced motion → the current static
     flex-wrap. Click on a tag still navigates to `/wanasis-fusion-erp-modules/#<slug>`.
   - Stats → `split-flap-board` for the three values, triggered once on scroll-in; real values are the DOM text
     (`dd`), flaps are `aria-hidden`; keyboard: nothing to operate (decorative). Keep current light layout + gradient.
   - Testimonials → `curtain-slider`: one slide per testimonial, background = AssetSlot T1–T4 for now (accept an
     optional `image` per slide for Phase 4), quote/name/role/company verbatim, arrows + keyboard + drag,
     aria-roledescription carrousel, live region.
   - NewsRail → `scale-slider` with the latest 6 posts (drag/throw), cards stay links; reduced motion → current rail.
6. Budget: Home JS ≤ 180KB gz excluding lazy chunks — dynamic-import (`next/dynamic`, `ssr: true` where the
   component renders meaningful HTML) the heavy ones (Draggable/Inertia sliders, tag cloud). Import GSAP plugins
   per component, register once.
