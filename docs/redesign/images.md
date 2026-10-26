# Images — art direction, route and manifest

## Route (decided)
**Mode B: Magnific MCP, Google Nano Banana 2.1, 2K**, as the client requested on 26 Oct 2026. The source photo is uploaded as an `image` reference when one exists. Upscale only when a crop needs more than 2K. Each prompt is saved to `garden-gpt-image-2/prompt/<slug>-<timestamp>.md`. 2 variants per shot; the orchestrator picks one or rejects both with a reason, logged in `assets/generated/manifest.json`.

## Photo bible (prepended to every prompt)
```text
WANASIS PHOTO BIBLE — Contemporary North-African enterprise photography, Constantine/Algiers business context.
Light: soft directional daylight from large windows, clean and bright, gentle falloff; no harsh flash, no lens flare.
Grade: cool neutral whites, shadows leaning deep petrol #00324B, midtones clean; subtle brand accents in the set only —
one teal #1CB1BD element (binder, lanyard, screen glow, signage stripe) and at most one small crimson #BB274B detail.
People: Algerian / North-African professionals, natural expressions, modest business attire, mixed genders, realistic skin texture, no retouched plastic look.
Settings: pharmaceutical distribution warehouses with labeled racks, GMP production lines, pharmacy counters, clinic corridors, modern Algerian offices with subtle local architecture through windows.
Camera: 35mm or 50mm, f/2.8, eye-level, documentary-editorial, shallow depth of field, 3:2.
Composition: subject on a third, generous negative space on the opposite side for headline overlay.
Strictly NO text, NO logos, NO brand names, NO readable labels, NO watermarks, NO fake UI with text.
```

## Shot list (ids used by builders in `AssetSlot` labels)
| id | Shot | Where | Ratio |
|---|---|---|---|
| H1 | DG reviewing operations on a laptop, pharma warehouse through a glass wall; negative space left | Home hero | 4:5 + 16:11 |
| H2 | Team around a screen (screen abstract/blurred) | Fusion hero | 4:5 |
| H3 | Hands assembling a puzzle in navy / teal / crimson pieces (recolor of the current photo) | Société hero | 3:2 |
| M-<slug> | One per Fusion module that has copy (12): re-staged in an Algerian pharma context, same lens and light | Fusion dialogs | 3:2 |
| A-view / A-link / A-pick / A-ship | Phone in hand in context (boardroom, pharmacy counter, picking aisle, delivery van); **flat chroma-green screen** | Fusion apps, mobile pages | 4:5 |
| L1 | Clinic reception | Life HIS | 3:2 |
| L2 | Nurse station with tablet (screen abstract) | Life HIS | 3:2 |
| L3 | Hospital pharmacy store-room | Life HIS | 3:2 |
| T1–T4 | Ambient, no people: distribution hub, production line, logistics dock, clinic corridor | Home testimonials | 3:2 |
| P1–P3 | Directors: **edit only**, background → petrol→teal studio gradient, identity untouched; client approval per image | Société | 3:4 |
| N-* | Post covers: real event photos get upscale/grade only; generic stock covers may be regenerated | Actualités | 16:10 |
| OG | 1200×630 per main page: photo generated, logo + title composited in code | meta | 1.91:1 |

**Never generated or altered:** the Wanasis logo, client logos (bg-removed only), real event photos (beyond grade/upscale), product UI, or anyone's identity.
