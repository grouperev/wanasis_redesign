# Open questions for Wanasis Solutions

Quotes are verbatim from the live site (`facts.md`). Nothing below has been changed on the new site. Each item stays as-is (or marked `[à valider]`) until the client rules.

## Blocking — content truth

**OQ-1 · Years of experience.** The site makes five different claims:

| Claim | Where |
|---|---|
| "+20 — Années d'expérience" | Home stats |
| "De part sa longue expérience, de 17 ans et de ses 30 implémentations…" | Home, Fusion ERP, /erp-algerie-fusion/ |
| "Depuis 19 ans…" | Société (director bio) |
| "Depuis 18 ans…" | Société (director bio) |
| "depuis près de 20 ans déjà" | blog post (ERP local vs international) |

→ Which figure is official, and since what year? (A founding year lets every page compute it.) Is "30 implémentations" still current next to "+100 Projets réussis"?

**OQ-2 · Product name.** Text uses Wanasis Fusion ERP, Fusion ERP, Wanasis ERP, WanaERP, WANASIS Business Suite, and (in testimonials) "Wanasis ERP basée sur Compiere" / "COMPIERE". → Which name is canonical for headings and badges? Testimonials stay verbatim regardless.

**OQ-3 · Stats +20 / +1400 / +100.** Confirm all three before they go on the split-flap board.

**OQ-4 · Client count.** `/reference` shows **91** unique logos; the home slider shows 29. → Can we write "91 entreprises nous font confiance", or is there an official number? We won't invent one.

## Blocking — assets

**OQ-5 · Vector logo.** Only PNGs exist (2000×200 color, 2000×429 white). → Please send the SVG/AI/PDF master for crisp rendering and the favicon.

**OQ-6 · Directors' portraits.** The current photos are 180×300 px, too small for the new cards. → Send higher-resolution originals. Or approve a background-only edit (petrol→teal studio backdrop; face, clothes and expression untouched). Each image would be sent for approval before publishing.

**OQ-7 · App screenshots.** No real screenshots of Fusion ERP, Life HIS or the Ship / View / Pick / Link apps exist on the site. → Please supply them (data anonymized). Until then, phone screens are flat placeholders marked "capture à fournir". We will not draw fake UI.

## Content structure

**OQ-8 · Life HIS grouping.** The 22 blurbs have no headings. We propose two groups (Médical: dossier, rendez-vous, consultations, admissions, unités, actes, laboratoire, bloc, examens invasifs, stérilisation, signes vitaux, radiologie, consentements · Managérial: staff, pilotage, facturation, réclamations, RH, stocks, paie, immobilisations, accompagnement) plus a short label for each. → Validate the grouping and labels.

**OQ-9 · Forms backend.** The Otter Blocks forms submit through WordPress. If we move off WordPress, where should submissions go: email to contact@wanasis.dz, a CRM, or keeping WP as a headless backend? This also decides who keeps publishing news, and how.

**OQ-10 · Missing module copy.** 12 grid modules have no description (Appels d'offre, Distribution, Parc roulant, Immo., GRH, Paie, Projet, E-Commerce, EDI, Générateur d'états, Messaging, Web, Mobile). Trésorerie has copy but no tile; BOM has a tile but no paragraph. → Send 2–3 lines each, or approve name-only tiles.

**OQ-11 · Implementation process.** The new "process rail" needs the real method. Proposed placeholder: Audit → Paramétrage → Migration → Formation → Go-live → Support, shown as `[à valider]` until confirmed.

**OQ-12 · Mobile Pick and Mobile Ship pages are empty.** → Send copy, or redirect them (301) to the apps section `/wanasis-fusion-erp-modules/#apps-mobiles`?

**OQ-13 · Duplicate Fusion page.** `/erp-algerie-fusion/` and `/wanasis-fusion-erp-modules/` cover the same product with different meta. Keep both (SEO landing + product page), or merge with a 301?

## Nice to know

**OQ-14 · Analytics.** The site has none. Add privacy-friendly analytics (e.g. Plausible or Vercel Analytics) to measure the redesign?

**OQ-15 · Typos (fixed unless you object).** "Directuer général" → "Directeur général"; "Votre sociéte" → "Votre société"; "De part sa" → "De par sa"; "Dim – Jeud: 8:00 am – 17:00 pm" → "Dim – Jeu : 8h00 – 17h00". The slug `/erp-agerie-team/` keeps its typo (protected URL).

**OQ-16 · Arabic version.** Tokens are RTL-ready (IBM Plex Sans Arabic). Is an AR site planned?

## Added during the build

**OQ-17 · Client logo files.** Most client logos on the old site are baked onto washed stock photos. An automatic background removal gave clean marks for 40 of the 91; the other 51 still show the original tile. → Ask clients (or the Wanasis sales team) for each logo as SVG or a transparent PNG.

**OQ-18 · Life HIS rows.** Under "Dossier Médical Partagé", "rendez-vous" and "consultations", the old page shows paragraphs copied from Fusion ERP (CRM, Vente, SAV). We left those rows without a detail panel. → Send the right Life HIS text. The page also has two blurbs that weren't in our OQ-8 list (achats, restauration); we put them under Managérial.

**OQ-19 · Post meta descriptions.** The WordPress meta descriptions are cut off at about 150 characters mid-sentence. → Can we replace them with the opening sentence of each post?

**OQ-20 · New micro-labels.** The forms and news pages use new interface wording: consent line, error messages, "À lire aussi", "Rechercher un client", "Envoi en cours…". The full list is in the builder reports summarized in the PR. → Please review.
