# wanasis.dz - stack and page metadata

Crawled from https://wanasis.dz (mechanical fetch, raw HTML in `raw/`). Counts: 50 routes (36 posts, 14 other pages/archives).

## CMS

- **WordPress**: `/wp-content/`, `/wp-includes/`, `/wp-json/` (REST), `xmlrpc.php?rsd`, and `/wp-content/plugins/*` URLs in every page. No `<meta name="generator">` tag is exposed, so the core version is not confirmed. `ver=7.1.3` on core block CSS and the child theme is a query string, not a verified core version.
- **Block editor (Gutenberg)** content, `wp-block-*` markup. **No Elementor** (0 matches for `elementor` on any page).
- **Theme**: Neve `3.8.9` (parent, ThemeIsle; `/wp-content/themes/neve/`). **Child theme** `wanasis-neve` v1.0.0 (`style.css` header: Template: neve, Author: k.raouf). The child stylesheet is nearly empty (`.nv-page-title h1 { font-size: 50px; }`). Real styling is in the Neve Customizer inline CSS (`raw/css/inline-index.css`, 23 `<style>` blocks).
- **Site language**: `<html lang="fr-FR">`, og:locale fr_FR.
- **SEO plugin**: sitemap XSL path `/wp-content/plugins/wordpress-seo/css/main-sitemap.xsl` in `sitemap_index.xml` (Yoast SEO, inferred from that path only).

## Plugins (from asset URLs)

| Plugin | Version (from `?ver=`) | Where |
|---|---|---|
| MetaSlider (`ml-slider`) | 3.96.0 | Home client-logo slider 'Ils nous ont fait confiance' (29 images) |
| Otter Blocks (`otter-blocks`, ThemeIsle) | build e43ccbd7086a7bbba3a1 | Contact and brochure forms (`otter-form__container`), advanced columns, posts-grid |
| Simple Sticky Element (`simple-sticky-element`) | 7.1.3 | Sticky red 'Nous contacter' element (`a.wana-sticky-element.red` -> /contact) |
| WordPress core bundles | jquery 3.7.1, jquery-migrate 3.4.1 | Loaded on every page |

## Forms

Both forms are Otter Blocks forms. No `action` or `method` attribute is in the markup, so submission is handled by the plugin's JavaScript; the server endpoint was not tested.

**/contact/** (`form.otter-form__container`)
- Visible fields: `Votre nom *` (text, required), `Votre email *` (email, required), `Votre message *` (textarea, required)
- One unlabeled checkbox (no label text in markup), hidden `…_nonce_field` and `_wp_http_referer`, button text `Envoyer`

**/demande-de-brochure/** (`form.otter-form__container`)
- `Votre email *` (email, required), `Votre nom` (text), `Votre téléphone` (text), `Votre sociéte *` (text, required; label spelling as published), `Votre site web` (text), `Votre message` (textarea)
- One unlabeled checkbox, hidden nonce and `_wp_http_referer`

Visible inputs have no `name` attributes in the static HTML (Otter generates ids such as `input-dcbb4f89-input`).

## Analytics / tags / chat

- **None found.** No gtag, GTM (`GTM-`), GA (`G-`/`UA-`), Facebook pixel (`fbq`), LinkedIn Insight, Hotjar, Clarity, TikTok pixel, or chat widget in any page or script `src`. Only `crisp` hits are CSS preset names (`--wp--preset--shadow--crisp`), not Crisp chat.
- Scripts loaded from external origins: none besides the site itself. Scripts seen: `jquery.min.js`, `jquery-migrate.min.js`, Neve `frontend.js`, MetaSlider scripts.

## Fonts

- Body font: **D-DIN** (`--bodyfontfamily: D-DIN`), loaded via `@font-face` from `/wp-content/themes/wanasis-neve/fonts/D-DIN.ttf` (49,276 bytes, downloaded to `raw/css/fonts/D-DIN.ttf`). Fallback `Arial, Helvetica, sans-serif` (`--nv-fallback-ff`).
- No Google Fonts or Typekit links. Headings are not given a separate family in the captured CSS.
- Plugin icon font: `flexslider-icon` (MetaSlider), not used for text.

## Colours

- Requested brand values `#2d4f7c`, `#1cb1bd`, `#00324b`: **0 matches** in every page and in all downloaded CSS.
- `#bb274b` (requested): present on all 53 HTML pages as the theme primary accent (`--nv-primary-accent:#bb274b`). Used in CSS only as that token.
- Other tokens from the Neve Customizer: `--nv-secondary-accent:#01216b`, `--nv-light-bg:#f0eff4`, `--nv-site-bg:#ffffff`, `--nv-text-color:#121212`, `--nv-text-dark-bg:#ffffff`, `--bgcolor:#01334c` (dark block background).

## Logos and icons

- **Header logo**: `/wp-content/uploads/2024/05/Logo_Wanasis_Large.png` (PNG, 2000x200). Downloaded to `assets/source/index/Logo_Wanasis_Large.png`. Smaller WordPress variants (-1024x102, -1536x154, -300x30, -768x77) also exist.
- **Footer logo**: `wanasis-logo-white.png` (white variant, 2000x429). Footer markup uses `http://192.168.1.48:8000/…/wanasis-logo-white-1024x220.png` on all 53 pages (dev host, leaked into production HTML). The public file is used instead. Saved as `assets/source/index/wanasis-logo-white.png`.
- **SVG logo: no.** No `.svg` file is referenced from `/wp-content/uploads/`. The header has two inline `<svg>` elements, which are menu/caret icons, not the logo.
- **Favicon**: `wanasis-favicon-512.png` (512x512), linked at 150x150 and 300x300 variants.
- **Product logos**: `fusion-erp.png` (200x50), `life-his.png` (200x50), `cite-white.png` (128x128, role unconfirmed).

## Meta by page (non-post routes)

| Route | <title> | meta description | canonical | og:title | og:image |
|---|---|---|---|---|---|
| `/` | Wanasis Fusion : L'ERP de choix pour les entreprises en Algérie | Vous recherchez un ERP en Algérie ? Wanasis Fusion ERP est le choix idéal, éprouvé aussi bien en Algérie qu'à l'international. | https://wanasis.dz/ | Wanasis Fusion : L'ERP de choix pour les entreprises en Algérie | https://wanasis.dz/wp-content/uploads/2025/01/Wanasis-Fusion-Life-ERP-Algerie.jpg |
| `/article/` | Article - Wanasis | (none) | https://wanasis.dz/article/ | Article - Wanasis | (none) |
| `/contact/` | Contact | (none) | https://wanasis.dz/contact/ | Contact | https://wanasis.dz/wp-content/uploads/2024/06/contact-banner.jpg |
| `/demande-de-brochure/` | Demande de brochure | (none) | https://wanasis.dz/demande-de-brochure/ | Demande de brochure | (none) |
| `/erp-agerie-team/` | Qui est Wanasis? | Accompagner les dirigeants en Algérie dans leurs projets ERP est notre mission, notre engagement et notre fierté. | https://wanasis.dz/erp-agerie-team/ | Qui est Wanasis? | https://wanasis.dz/wp-content/uploads/2024/06/about-banner.jpg |
| `/erp-algerie-fusion/` | Wanasis Fusion ERP pour l"Algérie | Optimisez la gestion de votre entreprise en Algérie avec notre ERP international, adapté aux spécificités locales en matière de fiscalité, de comptabilité, et d | https://wanasis.dz/erp-algerie-fusion/ | Wanasis Fusion ERP pour l"Algérie | https://wanasis.dz/wp-content/uploads/2024/06/fusion-banner.jpg |
| `/mobile-link/` | Mobile Link | (none) | https://wanasis.dz/mobile-link/ | Mobile Link | https://wanasis.dz/wp-content/uploads/2024/07/banner-link.jpg |
| `/mobile-pick/` | Mobile Pick | (none) | https://wanasis.dz/mobile-pick/ | Mobile Pick | (none) |
| `/mobile-ship/` | Mobile Ship | (none) | https://wanasis.dz/mobile-ship/ | Mobile Ship | (none) |
| `/mobile-view/` | Mobile View | (none) | https://wanasis.dz/mobile-view/ | Mobile View | https://wanasis.dz/wp-content/uploads/2024/07/banner-view.jpg |
| `/news/` | News - Wanasis | (none) | https://wanasis.dz/news/ | News - Wanasis | (none) |
| `/reference/` | Références | (none) | https://wanasis.dz/reference/ | Références | https://wanasis.dz/wp-content/uploads/2024/06/chark-pharm.jpg |
| `/wanasis-fusion-erp-modules/` | Wanasis Fusion ERP Modules | (none) | https://wanasis.dz/wanasis-fusion-erp-modules/ | Wanasis Fusion ERP Modules | https://wanasis.dz/wp-content/uploads/2024/06/erp-modules-banner.jpg |
| `/wanasis-life-his/` | Wanasis Life HIS | (none) | https://wanasis.dz/wanasis-life-his/ | Wanasis Life HIS | https://wanasis.dz/wp-content/uploads/2024/06/life-banner.jpg |

Posts (36): every post has its own `<title>`, meta description, canonical and og tags in `scripts/meta.json`. Titles and descriptions are not repeated here.

## Home (`/`) detail

- title: Wanasis Fusion : L'ERP de choix pour les entreprises en Algérie
- meta description: Vous recherchez un ERP en Algérie ? Wanasis Fusion ERP est le choix idéal, éprouvé aussi bien en Algérie qu'à l'international.
- canonical: https://wanasis.dz/
- og:locale: fr_FR
- og:type: website
- og:title: Wanasis Fusion : L'ERP de choix pour les entreprises en Algérie
- og:description: Vous recherchez un ERP en Algérie ? Wanasis Fusion ERP est le choix idéal, éprouvé aussi bien en Algérie qu'à l'international.
- og:url: https://wanasis.dz/
- og:site_name: Wanasis
- og:image: https://wanasis.dz/wp-content/uploads/2025/01/Wanasis-Fusion-Life-ERP-Algerie.jpg
- og:image:width: 2000
- og:image:height: 771
- og:image:type: image/jpeg

## Notes

- `/wanasis-erp-modules/` returns 404. The home page links to it from the Fusion ERP 'En savoir plus' link (`data-id="696"`). The live page is `/wanasis-fusion-erp-modules/`.
- `/mobile-pick/` and `/mobile-ship/` return 200 with a title and breadcrumb only. No body content is rendered.
- Sitemap: `/sitemap.xml` and `/wp-sitemap.xml` redirect (301). `/sitemap_index.xml` is the real index (post, page, attachment, category sitemaps).
- Asset folder convention: a file goes under its first route in `routes.txt`. Shared assets (header/footer logo, favicon, theme CSS images, home slider) sit under `assets/source/index/`.
- Asset roles are rule-based (`scripts/finalize.py`). Post header covers are classed `hero`; in-body post images are `news` only when not inside a cover. Team headshots were viewed. Client tiles, logos and icons were not viewed one by one, so their `has_people` is `unknown` (client tiles) or `n` (logo/icon/diagram by role).

