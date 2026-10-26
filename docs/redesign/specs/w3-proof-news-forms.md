# W3 — Références, Actualités, posts, Contact, Brochure, forms API (builder C)

Owns: `app/reference/**`, `app/actualites/**`, `app/article/**`, `app/news/**`, `app/[slug]/**` (posts),
`app/contact/**`, `app/demande-de-brochure/**`, `app/api/forms/**`, `components/news/**`, `components/forms/**`,
`components/proof/**`, `scripts/content-posts.py`, `lib/content/{posts-full,reference,contact}.json`,
`lib/content/image-lists/{news,reference}.json`, `components/annnimate/image-fly-in`.

1. **Références `/reference/`** — `image-fly-in` hero with the client logos flying around a clear centre holding
   the page's thank-you heading + text (verbatim from `content/reference.json`) and the real count
   "91 entreprises" ONLY if that phrase exists in the crawl — otherwise no count (OQ-4 open). Below: searchable logo
   wall (search input filters by `clientName()` from `lib/clients.ts`), neutral `bg-surface-2` tiles, grayscale →
   color on hover/focus, `placeholder={false}`. Category filters (Distribution / Production / Santé) are NOT possible
   without data → omit them and report it. Register all 91 logos at `[160, 320]` (most already exist in the manifest).
2. **Posts** — `scripts/content-posts.py` → `lib/content/posts-full.json`: for each of the 35 posts in
   `lib/content/posts.json` (keep its slug/route/title/date/author/category/cover), the full body as ordered blocks
   `{type: "h2"|"h3"|"p"|"ul"|"img", text|items|src}` parsed from `content/<slug>.json` sections (headings →
   h2/h3, paragraphs, bullet lists — keep verbatim; apply `ruled()` only for "Posted on" and product naming).
   Route: `app/[slug]/page.tsx` with `generateStaticParams` over posts + `dynamicParams = false`.
   Template: reading width 68ch, `h1 data-reveal`, "Publié le <date> par <auteur>" + category chip, cover via
   `Picture` (priority), body blocks with good editorial rhythm (h2 46px→ section rhythm, lists styled), related
   posts (3, same category, else latest), back link to `/actualites/`. JSON-LD `BlogPosting`.
3. **Actualités `/actualites/`** — featured (latest) post large + grid of the rest with category chips
   (Tous / Article / News — client-side filter, no-JS shows all). Pagination contract: the old site had
   `/actualites/page/2/` … `/page/4/` → generate those routes (9 posts per page, same template, canonical to self)
   so old links keep working. `/article/` and `/news/` = category archives (same grid filtered). French dates.
4. **Contact `/contact/`** — two-column: form + coordinates (`SITE` in `lib/site.ts`), map is NOT included.
   Fields exactly as the old form (`docs/redesign/stack.md`): nom* (text), email* (email), message* (textarea),
   consent checkbox (label: "J'accepte que mes données soient utilisées pour traiter ma demande." — this is a new
   micro-label, report it). `name` attributes: `nom`, `email`, `message`, `consentement`.
5. **Brochure `/demande-de-brochure/`** — fields: email*, nom, telephone, societe*, site_web, message, consentement;
   labels verbatim from stack.md but fix "sociéte" → "société".
6. **Forms API `app/api/forms/route.ts`** (POST, runtime nodejs): validate (required, email format, max lengths),
   honeypot field `website2`, then if `process.env.RESEND_API_KEY` is set send an email with `fetch` to
   `https://api.resend.com/emails` (from `process.env.FORMS_FROM` default "Wanasis <noreply@wanasis.dz>", to
   `process.env.FORMS_TO` default "contact@wanasis.dz", reply_to = sender email); else return 503
   `{ok:false, reason:"not_configured"}`. Client component submits with fetch, shows states: idle / sending /
   success ("Merci, votre message a bien été envoyé.") / error (with `mailto:contact@wanasis.dz` fallback link).
   Progressive enhancement: the `<form>` also has `action="/api/forms" method="post"`; the route redirects to
   `?envoye=1` for non-JS posts. Add `.env.example` with the three vars.
7. Metadata for every page from `docs/redesign/crawl/meta.json`.
