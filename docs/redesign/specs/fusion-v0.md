# Spec — Fusion ERP page, v0 (`/wanasis-fusion-erp-modules/`)

v0 = structure + tokens + real copy + `[image]` slots. **No GSAP, no Annnimate yet** — but build each section so the
named Annnimate component can replace its inner block in Phase 5 without layout changes.

## Inputs
- Copy: `lib/content/fusion.json` (already ruled; render verbatim, never retype copy).
- Tokens/utilities: `app/globals.css` (`container-x`, `section-y`, `measure`, `eyebrow`, `btn btn-action|btn-ghost`,
  `brand-mesh`, `brand-mesh-light`, `asset-slot`, color/text tokens like `text-h1`, `bg-fam-commercial`, `text-ink-2`).
- Components: `components/ui/Picture.tsx` (`Picture`, `AssetSlot`). Shared section primitives in `components/ui/` if you
  need them — prefer adding to `components/fusion/`.
- Design system: `docs/redesign/design-system.md` (read fully).

## Sections (in order)
1. **Hero** — two columns ≥1024 (7/5), stacked below. Left: eyebrow "Fusion ERP" (dual-scramble later), H1 =
   `hero.title` + line break + `hero.tagline` (use `text-h1`, tagline in `text-gradient`), `hero.intro` as a lead
   paragraph clamped to the first 2 sentences with a "Lire la suite" `<details>` disclosure for the rest
   (copy must stay complete in the DOM). CTAs: `btn-action` "Demander une démo" → `/contact/`, `btn-ghost`
   `brochure.text` → `brochure.url`. Right: `AssetSlot` label "H2 · équipe autour d'un écran" ratio 4/5.
   Background: `brand-mesh-light` on surface.
2. **Sticky family filter** — `position: sticky; top: var(--header-h)`; chips "Tous" + the 5 `families`; each chip shows
   a 10px dot in its family color and a count. Client component; filtering hides tiles via `hidden` + updates
   `aria-pressed`. Horizontal scroll on mobile (no wrap), 44px min tap height. Updates URL hash? No — use
   `?famille=` is not possible in static export; keep state local.
3. **Module grid** — `ul` of 26 tiles, CSS grid 2 cols mobile / 3 md / 4 xl, gap 12px. Tile = button (opens dialog)
   with: family-colored top band 4px tall; module name in `font-display text-h3`; family label `text-small text-ink-2`;
   the original `chip` color as a 4px × 24px pill next to the name (skip if `chip` null); "Voir le module" affordance
   only when `body` exists, otherwise label "Description à venir" (OQ-10) and tile is not clickable (render `div`).
   Radius 12, hairline border, hover lifts border to ink/20 + shadow-e1. Each tile has `id={slug}` anchor target.
4. **Module dialog (v0 = native `<dialog>`)** — opens on tile click; shows family label, name (`text-h2`), photo slot
   (`AssetSlot` "M · {name}" ratio 3/2), full `body`, close button (top right, 44px). `Escape` closes, focus returns
   to the tile. On load, if `location.hash` matches a module with body, open it (deep link `#crm`).
   **SEO/no-JS fallback**: below the grid, render a visually-collapsed but crawlable `<section aria-label="Détail des
   modules">` with every module that has a body as `<article id="detail-{slug}">` (`h3` + body). Use a
   `<details>` per module (closed by default) — the dialog is the enhancement.
5. **"Une Solution Complète et Modulaire"** — `complete.title` as `text-h2` + `complete.body` in `measure`; right/below:
   process-rail placeholder: ordered list of 6 steps Audit → Paramétrage → Migration → Formation → Go-live → Support
   with each step tagged `[à valider]` (`text-small text-action`), connected by a 1px teal line. Static.
6. **Mobile apps** (`id="apps-mobiles"`) — `apps.title` as `text-h2`. 4 cards (2×2 ≥768, 1 col mobile) on `bg-depth`
   section with `on-dark` class: name ("Ship", "View"…) in `font-display text-h2`, prefixed eyebrow "Mobile";
   `AssetSlot` "A · {name} — écran : capture à fournir" ratio 4/3; body text; link "En savoir plus" → `href`.
7. **Brochure CTA band** — `brand-mesh on-dark` band. No new heading copy: show the Fusion ERP badge
   (`/brand/fusion-erp.png`, 200×50, on a white 8px-radius plate for legibility) and two buttons:
   `btn-action` `brochure.text` → `brochure.url`, `btn-ghost` "Nous contacter" → `/contact/`.

## Metadata
`export const metadata = { title: "Wanasis Fusion ERP Modules", alternates: { canonical: "/wanasis-fusion-erp-modules/" },
openGraph: { title: "Wanasis Fusion ERP Modules", url: "/wanasis-fusion-erp-modules/" } }`.

## Rules
- Files you own: `app/wanasis-fusion-erp-modules/page.tsx`, `components/fusion/**`. Do not edit other files; if you
  need a shared change, describe it in your report instead.
- No hard-coded colors (use tokens: `bg-fam-${family}` classes must be written out literally in a map so Tailwind
  sees them). No new copy except UI micro-labels: "Tous", "Voir le module", "Description à venir", "Fermer",
  "Lire la suite", "Demander une démo", "Nous contacter", "En savoir plus", "[à valider]".
- Accessibility: WCAG 2.2 AA, visible focus, dialog has `aria-labelledby`, chips are `button[aria-pressed]`.
- Server component by default; only the filter+grid+dialog island is `"use client"`.
- Next.js 16 (see `node_modules/next/dist/docs/` if unsure). Static export.
- Verify with `npx tsc --noEmit` and `npx eslint app/wanasis-fusion-erp-modules components/fusion`. Do NOT run
  `next build` or `next dev` (the orchestrator runs them).
