# Builder rules (all waves)

Read first: `docs/redesign/design-system.md` (APPROVED), `docs/redesign/brand-spec.md`, `app/globals.css`,
`components/ui/Picture.tsx`, `lib/site.ts`, `lib/format.ts`, and the existing pages `app/page.tsx` +
`app/wanasis-fusion-erp-modules/page.tsx` (match their code style and visual vocabulary exactly).

## Stack
Next.js 16 App Router (read `node_modules/next/dist/docs/` before using any API beyond pages/metadata/Link —
params are Promises in v16), React 19, Tailwind v4 (tokens in `@theme` → classes like `bg-depth`, `text-h2`,
`text-ink-2`, `bg-fam-supply`), GSAP 3.15 + `@gsap/react` (all plugins are free and in the `gsap` package).
Hosted on Vercel; all pages prerendered (`generateStaticParams` + `dynamicParams = false` for dynamic routes).
URLs keep a trailing slash (`trailingSlash: true`).

## Content
- Copy is verbatim from the crawl in `content/<slug>.json`. Generate your area's data with your own script
  `scripts/content-<area>.py` that imports `scripts/content_rules.py` (`ruled`, `load`, `paragraphs`, `write`) and
  writes `lib/content/<area>.json`. Apply `ruled()` to all copy except testimonials/quotes. Never retype copy by hand.
- Allowed new UI micro-labels only (buttons, aria-labels, "Lire la suite", filter names, form states). Any other
  new copy → list it in your report as a proposal; don't ship it.
- French typography: wrap display strings with `frTypo()` from `lib/format.ts`.

## Images
- Render with `Picture` (manifest-backed). Register every source file you need in
  `lib/content/image-lists/<area>.json` as `[["file.jpg", [640, 960, 1280, 1920]], …]` (logos `[160, 320]`).
  **Do not run** `scripts/images.mjs` — the orchestrator runs it; until then `Picture` shows an `AssetSlot`.
- Stock photography is being replaced (Phase 4). For hero/module/scene photos use `AssetSlot` with the shot id from
  `docs/redesign/images.md` (e.g. "L1 · accueil de clinique"). Real assets (client logos, post covers, directors'
  portraits, product badges, diagrams) use `Picture`.

## Motion (Annnimate)
- Components live in `vendor/annnimate/<slug>/` (React: `<slug>.jsx` + `.css`, start from `example.jsx`). Copy the
  ones you own into `components/annnimate/<slug>/` unchanged except: props/colors/durations from tokens and
  `lib/motion.ts`, `"use client"` kept, TypeScript not required (keep `.jsx`, add a `<slug>.d.ts` if needed).
- Every animation: honors `prefers-reduced-motion` (render the final state), CLS 0 (reserve space), content is
  in the SSR HTML and readable without JS. Max 2 signature components per viewport.
- Headings: put `data-reveal` on page `h1`s and `data-scramble` on product/app badges' text; the global
  `MotionRoot` (wave 1) wires text-reveal / dual-scramble from those attributes. Do not import text-reveal yourself.

## Ownership & verification
- Only touch the files your spec lists. Need a shared change? Describe it in your report.
- Verify: `npx tsc --noEmit` and `npx eslint <your paths>` clean. **Do not run `next build`, `next dev`, or git.**
- Report: files created, deviations + why, proposed copy, images you registered, open questions.
