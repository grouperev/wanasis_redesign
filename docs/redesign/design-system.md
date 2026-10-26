# Wanasis — design system

Status: **PROPOSED, awaiting Checkpoint 1 approval.** Builders must not start until this line reads APPROVED.

## Design Read

```yaml
Design Read:
  artifact: multi-page B2B marketing site (FR), ERP/HIS vendor, Algeria — 50 routes
  audience: DG / DAF / pharmacist-owners of pharma distribution & production SMEs, clinic directors
  visual-language: institutional-precise B2B software — calm white space, petrol depth,
                   the logo gradient as the one signature, one crimson action color, DIN-engineered detail
  mode: redesign-preserve
  visual-variance: 6     # one asymmetric hero + one signature layout per page; stable grid spine elsewhere
  motion-intensity: 6    # max 2 signature components per viewport; everything else is 150–450ms state feedback
  information-density: 5 # marketing density; Fusion/Life HIS hide depth behind dialog/accordion, not off-site
  asset-dependence: 8    # unified photography is the biggest lift → photo bible before any layout polish
  brand-fidelity: 8      # logo, gradient, crimson, D-DIN, IA, copy untouched
```

**What the dials change.** Variance 6 gives the hero an off-axis split (H1 on the left third, photo bleeding right) and keeps every other section on a 12-column spine. Motion 6 caps each viewport at 2 Annnimate components, and each one has a reduced-motion state that shows the final frame. Assets 8 means no layout ships with stock imagery: it uses graded generated photos or an honest `[image]` slot. Fidelity 8 forbids new hues; derived tones come from the brand hexes via oklch.

## Positioning (Step 3a)

| Page | Narrative role | Distance | Temperature |
|---|---|---|---|
| Home | Hero → proof → products → proof | 1m laptop / 30cm phone | authoritative, warm |
| Fusion ERP | Catalogue, navigable reference | 1m | precise |
| Life HIS | Reassurance, structured scope | 1m | calm, clinical-clean |
| Société | People and roots | 1m | warm, proud |
| Références | Proof wall | 1m | quiet confidence |
| Actualités | Reading | 50cm | editorial |

## Design Decisions

- **Anchor**: custom, from the brand assets. *Structural rhythm only* from `linear` (spacing scale, restrained surfaces, quint ease, radius ≤ 16). *Gradient treatment only* from `vercel-mesh`, rebuilt strictly from `#2D4F7C → #1CB1BD` over `#00324B`. Neither recipe's palette or fonts.
- **Color**: see `brand-spec.md`. Ratios per viewport: surfaces ~80%, ink ~12%, navy/teal ~6%, crimson ≤ 5%. The mesh appears only in the hero underlay (≤ 12% opacity on white), the final CTA band and the footer (on `--depth`). There is no other gradient anywhere.
- **Module families**: 5 tones, each derived in oklch from the brand, keeping each tile's original color as a 4px chip.

  | Family | Tone | Modules (from `erp-modules.png` + Trésorerie) |
  |---|---|---|
  | Commercial | `#2D4F7C` navy | CRM, Vente, SAV, Appels d'offre, Distribution, E-Commerce |
  | Finance | `#1E6E8C` blue-teal | Comptabilité, Trésorerie, Gestion des coûts, Immo. |
  | Production & Supply | `#0E7680` teal-ink | Production, BOM, MRP, Maintenance, Achat, Importation, Logistique, Parc roulant |
  | RH & Admin | `#4A5B68` slate | GRH, Paie, Projet, Générateur d'états |
  | Digital & Mobile | `#00324B` petrol | EDI, Messaging, Web, Mobile (Ship · View · Pick · Link) |

  All five carry white text at ≥ 4.6:1. Crimson is never a family color.
- **Typography**: D-DIN Bold for display, D-DIN Regular for eyebrows, nav and numbers (tabular), IBM Plex Sans for body. Fluid scale (`clamp`), ratio ~1.25 on mobile and ~1.333 on desktop:

  | Token | Mobile → Desktop | Use |
  |---|---|---|
  | `display` | 44 → 80px, lh 1.0, −0.02em | Home H1 |
  | `h1` | 36 → 60px, lh 1.05 | page H1 |
  | `h2` | 28 → 46px, lh 1.1 | sections |
  | `h3` | 21 → 26px, lh 1.25 | cards, modules |
  | `body-lg` | 19 → 21px, lh 1.55 | leads |
  | `body` | 17 → 18px, lh 1.6, max 68ch | text |
  | `small` | 15px, lh 1.5 | meta, captions |

  Title:body ≥ 2.5× for h2 and above at desktop (h2 46/18 = 2.56).
- **Spacing**: 4px base. Scale 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128. Section padding is `clamp(64px, 10vw, 128px)`. Container is fluid, `min(100% − 2×gutter, 1320px)`, gutter `clamp(16px, 4vw, 40px)`. Reading width 68ch.
- **Radius**: 4 for inputs and chips, 8 for buttons, 12 for cards and tiles, 16 for dialogs and large media. Nothing above 16. Pills are used only for filter chips.
- **Borders and shadow**: hairline `1px rgba(11,31,46,.08)` separates surfaces. Elevation: e1 `0 1px 2px rgba(0,50,75,.08)`, e2 `0 8px 24px -8px rgba(0,50,75,.16)` (dialog, drawer). No glows, no colored shadows.
- **Motion** (`motion.ts`): ease-out `cubic-bezier(.22,1,.36,1)`. Durations: 150ms (hover/focus), 300ms (UI), 450ms (layout), 800ms (H1 reveal total). Scroll triggers fire once. `prefers-reduced-motion` gives the final state with no transforms.
- **Focus**: 2px `--teal-ink` outline with 2px offset on light, `--teal` on dark.
- **Iconography**: none drawn. Module identity is name + family tone + original chip. Where an icon is truly needed, use a `[icon]` slot until a set is chosen.

## Annnimate mapping and budget

As in the orchestration brief §6, with these confirmed adjustments:
- `magnetic-tag-cloud` uses **25** grid modules + Trésorerie = 26 tags, not 22.
- `image-fly-in` center copy uses the real count (91, OQ-4). It is not shipped until confirmed.
- `split-flap-board` and `process-rail` are built but show `[à valider]` until OQ-1/3/11 are answered.
- `ascii-overlay`: deferred. I'll decide after v0 against the 60KB-gz budget.
- `pricing`: not used.

## Stack (recommended, needs OQ-9)

Next.js App Router + TypeScript + Tailwind v4 (tokens as CSS variables) + GSAP, static export, Annnimate React versions. Posts are migrated to MDX. Forms post to a serverless endpoint that emails contact@wanasis.dz. Every URL is preserved with its trailing slash (`trailingSlash: true`).
