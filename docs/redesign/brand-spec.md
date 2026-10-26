# Wanasis — brand spec

Every page references these files. Nothing is redrawn.

## Logo

| Asset | Path | Notes |
|---|---|---|
| Wordmark, color | `assets/brand/Logo_Wanasis_Large.png` | 2000×200 RGBA. Gradient sampled `#285078` (W) → `#18A8B8` (S) |
| Wordmark, white | `assets/brand/wanasis-logo-white.png` | 2000×429, for petrol / photo grounds |
| Fusion ERP badge | `assets/brand/fusion-erp.png` | 200×50 |
| Life HIS badge | `assets/brand/life-his.png` | 200×50 |
| Favicon | `assets/source/index/wanasis-favicon-512.png` | 512×512 |
| **Vector master** | — | **Missing (OQ-5).** PNG is the master until supplied |

Clear space = cap height of the "W" on every side. Minimum width is 120px. Never recolor it, never set it on the brand gradient, never generate it.

## Color (proposed, pending Checkpoint 1)

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--ink` | `#0B1F2E` | text | 16.8 on white |
| `--ink-2` | `#4A5B68` | secondary text | 7.0 on white |
| `--surface` | `#FFFFFF` | page | — |
| `--surface-2` | `#F4F7F9` | bands, logo tiles | — |
| `--depth` | `#00324B` | footer, CTA band, mesh base | white 13.5 |
| `--navy` | `#2D4F7C` | gradient start, headings accent | 8.3 on white |
| `--teal` | `#1CB1BD` | gradient end, on-dark accent only | 2.6 on white ✗ · 5.2 on depth ✓ |
| `--teal-ink` | `#0E7680` | teal for text/focus on light grounds | 5.35 on white |
| `--action` | `#BB274B` | CTA and key links only, ≤5% of a viewport | 5.99 on white; white on it 5.99 |

## Type

| Role | Family | Source |
|---|---|---|
| Display / UI labels | **D-DIN** (Regular + Bold), the brand's current face | Datto, SIL OFL. Self-hosted. The site only ships Regular (`assets/brand/D-DIN.ttf`); Bold is taken from the OFL release |
| Body | **IBM Plex Sans** 400/500/600 | OFL, `@fontsource/ibm-plex-sans`. Arabic sibling available for RTL |

## Photography

Source originals: `assets/source/<route>/`, indexed in `assets/source/inventory.csv`. Generated set: `assets/generated/` with `manifest.json` (Phase 4). The photo bible lives in `images.md`.

## Real people

- Directors: `assets/source/erp-agerie-team/{amar,hamza,redha}.jpg`. Edit only, with client approval per image.
- Testimonial authors: **no photos, and no stand-ins.**
