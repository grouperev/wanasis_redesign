# W2 — Fusion motion, Life HIS, Société, product sub-pages (builder B)

Owns: `components/fusion/**`, `components/product/**`, `app/wanasis-fusion-erp-modules/**`,
`app/wanasis-life-his/**`, `app/erp-agerie-team/**`, `app/erp-algerie-fusion/**`, `app/mobile-*/**`,
`scripts/content-products.py`, `lib/content/{life,societe,fusion-algerie,mobile}.json`,
`lib/content/image-lists/products.json`, and `components/annnimate/{feature-dialog,process-rail,accordion,echo-headline}`.

Content sources: `content/wanasis-life-his.json`, `content/erp-agerie-team.json`, `content/erp-algerie-fusion.json`,
`content/mobile-{view,link,pick,ship}.json`, plus `lib/content/fusion.json` (don't regenerate it).
`docs/redesign/facts.md` §6 lists the 22 Life HIS blurbs in page order; §8 the directors.

1. **Fusion ERP page** — keep the v0 structure. `h1 data-reveal`. Replace the native `<dialog>` with
   `feature-dialog` (tile = preview, opens tall dialog with family label, name, `AssetSlot "M-<slug> · <name>"` 3:2,
   full body). Keep `#slug` deep links, filter, crawlable details section, focus/escape/backdrop.
   Process rail → `process-rail` (6 steps, `[à valider]` tags stay). App names `data-scramble`.
   Fix: on <480px tiles, move the original-color chip into the top band (left 24px of the 4px band) so names don't
   wrap around it; family label `text-small` single line (`truncate`).
2. **Life HIS `/wanasis-life-his/`** — hero (`h1 data-reveal`, title from content JSON, intro blurb #1, CTAs
   "Demander une démo" → /contact/, "Nous contacter"), Life HIS badge with `data-scramble`; **accordion matrix**
   with two groups "Médical" / "Managérial" (OQ-8 proposal in `docs/redesign/open-questions.md` lists which blurb
   goes where; mark the two group headings + each item label `[à valider]` only in a dev-visible way: a
   `title` attribute is enough — don't print it). Item label = the blurb's leading noun phrase is NOT allowed
   (invention); so each accordion row shows the blurb sentence itself as the row title, and the row body holds any
   following detail lines from the crawl (many blurbs end with ":" followed by bullet lines in the raw page — check
   `content/wanasis-life-his.json` sections for those lists and attach them). One group open at a time.
   Then 3 scene slots L1–L3 (asymmetric trio, not a zigzag), the Clinique Avicenne testimonial (verbatim, from
   `lib/content/home.json`), CTA band on `brand-mesh`.
3. **Société `/erp-agerie-team/`** — `echo-headline` "ENSEMBLE" (one instance), the quote « L'Algérie dans Nos
   Racines, L'ERP dans Nos Veines, Votre Réussite dans Nos Aspirations » (verbatim from the crawl), page intro copy,
   3 director cards: portrait via `Picture` (register `amar.jpg`, `hamza.jpg`, `redha.jpg` at `[180]` only — they are
   180×300, never upscale), name, title, full bio verbatim (bios contain "Depuis 19 ans"/"Depuis 18 ans" — personal
   careers, keep verbatim), LinkedIn link. Partner text. `process-rail` reused ("Notre méthode" is NEW copy → use
   no heading; just render the rail under the partner text with the same `[à valider]` tags). H3 slot for the hero.
4. **`/erp-algerie-fusion/`** — SEO landing (keep its own title/meta from `docs/redesign/crawl/meta.json`): hero with
   its own copy, the 25-tile module diagram re-drawn as a real HTML/SVG grid from `lib/content/fusion.json`
   (family tones + chips, each tile links to `/wanasis-fusion-erp-modules/#slug`), remaining copy, CTAs.
5. **Mobile pages** `/mobile-view/`, `/mobile-link/` — template: hero (app name `data-scramble`, eyebrow "Mobile"),
   phone slot `A-<slug>` 9:19, body copy verbatim, back link to `/wanasis-fusion-erp-modules/#apps-mobiles`.
   `/mobile-pick/`, `/mobile-ship/` have no page copy: render the same template using the app's paragraph from
   `lib/content/fusion.json` (that copy is real, from the Fusion page) — note this in your report (OQ-12).
6. Metadata for every page from `docs/redesign/crawl/meta.json` (title, description, canonical, og).
