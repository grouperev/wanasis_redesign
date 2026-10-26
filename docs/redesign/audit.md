# wanasis.dz — Redesign audit

Baseline: the live site crawled on 26 Oct 2026 (`docs/redesign/stack.md`, `content/*.json`, `docs/redesign/facts.md`) and the client screenshots from the same day.

## Decision record

```text
Mode:                 Redesign · Preserve (hero and key sections may be recomposed, modernization step 7)
Preserve:             logo + navy→teal wordmark gradient, crimson #BB274B action color, D-DIN type voice,
                      IA and nav labels, every route/slug, all French copy, 4 testimonials, client logos,
                      directors, footer tagline and contacts, both forms' fields
Improve:              hierarchy and contrast, body size, fluid containers, imagery (one graded photo world),
                      Fusion ERP page navigation, module color system, stats and testimonials, the floating CTA
Remove:               random washed photos behind client logos, English "Posted on … by", the dev-host footer
                      logo URL, dead link to /wanasis-erp-modules/, MetaSlider/jQuery runtime
Protected contracts:  see §4
Design Read + dials:  see design-system.md
Highest-risk change:  replacing the 22-block Fusion ERP wall with a filtered grid + dialogs (SEO and deep links)
Rollback / fallback:  every module keeps a server-rendered anchor section (#crm, #vente…); the dialog is an
                      enhancement over that, so with no JS the page still reads top-to-bottom
```

## 1. Current stack

- WordPress, Neve 3.8.9 + child theme `wanasis-neve`, block editor (no Elementor), Yoast (inferred).
- Plugins: MetaSlider (home logo slider), Otter Blocks (forms, columns, posts grid), Simple Sticky Element (the floating "Nous contacter").
- 50 routes: 14 pages/archives + 36 posts. No analytics tags of any kind.
- 2 forms (Otter Blocks, JS-submitted, no `name` attributes): `/contact/` and `/demande-de-brochure/`.

## 2. Visual system as found

| Layer | Finding |
|---|---|
| Color | Only `#BB274B` (Neve primary accent) is a real token. Others in CSS: `#01216B` secondary, `#01334C` dark block, `#F0EFF4` light bg, `#121212` text. The navy/teal (`#2D4F7C` → `#1CB1BD`) lives **only in the logo PNG**, sampled at `#285078` → `#18A8B8`. |
| Module palette | 25 tiles in `erp-modules.png`, each with its own saturated hue (orange, yellow, rose, olive, near-black…). They don't relate to the brand. |
| Type | D-DIN Regular only (self-hosted TTF, 49 KB). No bold cut is loaded, so headings are faux-bold or regular. Body is about 15–16px with grey text. |
| Layout | Fixed ~1170px container; dead margins at ≥1440. Long alternating image/text zigzags (Fusion: 13 modules; Life HIS: 23 blurbs). |
| Imagery | 43 hero + 47 module photos: Western stock (suits, handshakes), mixed grade, none Algerian or pharma-specific. Example: `erp-module-crm.jpg` is a generic four-person suit portrait. |
| Logos | 91 unique client logos on `/reference` over washed photos. 29 in the home MetaSlider. |
| Motion | Only the slider auto-advance. |

## 3. Content and IA as found

Nav: ACCUEIL · SOCIÉTÉ · SOLUTIONS ▾ (Fusion ERP, Life HIS, mobile apps) · RÉFÉRENCES · ACTUALITÉS · CONTACT, plus the sticky crimson "Nous contacter".

| Route | Role | Notes |
|---|---|---|
| `/` | Home | hero, mission, Fusion + Life HIS intros with diagrams, stats +20/+1400/+100, 4 testimonials, logo slider, latest news |
| `/erp-agerie-team/` | Société | quote, 3 directors with LinkedIn, partner text. The slug typo ("agerie") is protected |
| `/wanasis-fusion-erp-modules/` | Fusion ERP | hero + brochure CTA, module grid, 13 detailed modules (no BOM paragraph; MRP paragraph duplicated), 4 mobile apps |
| `/erp-algerie-fusion/` | Fusion ERP (Algeria landing) | second Fusion page with `erp-modules.png` (25 tiles), own meta |
| `/wanasis-life-his/` | Life HIS | intro + 22 module blurbs, no headings |
| `/mobile-view/`, `/mobile-link/` | App pages | have body copy |
| `/mobile-pick/`, `/mobile-ship/` | App pages | **empty** (title + breadcrumb only) |
| `/reference/` | Références | thank-you text + 91 logos |
| `/actualites/` (+ /page/2–4), `/article/`, `/news/` | News + category archives | 36 posts |
| `/contact/` | Contact | form (nom, email, message, checkbox) + address/phones/hours |
| `/demande-de-brochure/` | Brochure request | form (email, nom, téléphone, société, site web, message, checkbox) |

## 4. Protected contracts

- All 50 routes in `routes.txt`, with trailing slashes as served. Category archives `/article/`, `/news/` and `/actualites/page/N/`.
- Nav labels and order above.
- Logo files (`assets/brand/`). No SVG exists, so the PNG is the master until the client supplies vectors.
- All French copy, verbatim. Allowed fixes: typos and "Posted on → Publié le". Everything else goes to `open-questions.md`.
- Testimonials (quote / name / title / company), director names, titles and LinkedIn URLs, footer contacts.
- Form fields, order and required flags for both forms. The submission backend changes with the stack (OQ-9).
- `<title>`, meta description, canonical and og:* per route (`crawl/meta.json`), `lang="fr"`.
- Home link "En savoir plus" currently points to a 404. Fixing it to `/wanasis-fusion-erp-modules/` is a bug fix, not a contract change.

## 5. Preserve / Improve / Remove

### Preserve
- The logo's gradient as **the** brand signature. It becomes the only gradient on the site (mesh in petrol depth).
- Crimson `#BB274B` as the single action color. It passes AA on white (5.99:1).
- D-DIN's engineered DIN voice. It matches the squared geometry of the wordmark.
- Testimonials, client wall and stats: real proof, just badly staged.
- The Fusion module grid concept: clients recognize their module colors.

### Improve
1. **Hero**: text sits over a busy photo with no product proof. Recompose with a negative-space photo, H1 on a clean ground, and a slot for real UI (screenshots requested, OQ-12).
2. **Fusion ERP**: 13-block zigzag → family filter + tile grid + dialog, each module keeping its anchor.
3. **Life HIS**: 22 unheaded blurbs → Médical / Managérial accordion. The headings are derived from the blurbs and must be validated (OQ-8).
4. **Module colors**: 25 hues → 5 family tones + original-color 4px chip.
5. **Client logos**: washed photos → neutral `#F4F7F9` tiles, grayscale → color on hover.
6. **Testimonials and stats**: grey boxes → full-bleed curtain slider; flat numbers → split-flap with real DOM text.
7. **Type and contrast**: body 17–18px, ink `#0B1F2E`, 60–75ch measure, fluid container.
8. **CTA**: floating sticky overlaps content → header CTA + mobile bottom bar.
9. **Language**: "Posted on … by" → "Publié le … par".

### Remove
- MetaSlider, jQuery, Simple Sticky Element, the washed logo backdrops.
- The dev-host footer logo (`192.168.1.48:8000`, leaked into all 53 pages).
- The duplicated MRP paragraph (it renders twice). This removes a duplicate, not copy.

## 6. Quality debt worth flagging

- No analytics at all: the client can't measure the redesign. Ask whether to add one (OQ-14).
- `/mobile-pick/` and `/mobile-ship/` are indexable empty pages.
- 12 of the 25 grid modules have no description anywhere on the site (Appels d'offre, Distribution, Parc roulant, Immo., GRH, Paie, Projet, E-Commerce, EDI, Générateur d'états, Messaging, Web, Mobile). Trésorerie has copy but no grid tile.
