# QA — 26 Oct 2026 (production build, `next start`, localhost)

| Route | Preset | LCP | CLS | TBT | Perf | A11y | SEO | Weight |
|---|---|---|---|---|---|---|---|---|
| / | mobile | 3.2s | 0.000 | 192ms | 90 | 100 | 100 | 459 KiB |
| / | desktop | 2.9s | 0.000 | 80ms | 95 | 100 | 100 | 459 KiB |
| /wanasis-fusion-erp-modules/ | mobile | 3.7s | 0.000 | 419ms | 79 | 96→100* | 100 | 425 KiB |
| /wanasis-fusion-erp-modules/ | desktop | 3.6s | 0.000 | 112ms | 89 | 96→100* | 100 | 425 KiB |
| /reference/ | mobile | 1.9s | 0.000 | 311ms | 93 | 100 | 92→100* | 483 KiB |
| /actualites/ | mobile | 3.2s | 0.000 | 303ms | 87 | 100 | 92→100* | 463 KiB |
| /le-mrp-pilier-…/ (post) | mobile | 2.9s | 0.000 | 454ms | 84 | 100 | 100 | 369 KiB |

\* Fixed after the run: the process-rail contrast (no more opacity dimming), the header active colour, and the missing meta descriptions. axe re-run: **0 violations** on /, /wanasis-fusion-erp-modules/, /erp-agerie-team/ (and 0 before on /reference/, /actualites/, a post, /contact/, /wanasis-life-his/).

- **Route parity:** all 50 crawled routes + /actualites/page/2–4 return 200. `/wanasis-erp-modules/` 308s to `/wanasis-fusion-erp-modules/`.
- **Internal links:** 79 unique targets, 0 broken.
- **Console:** 0 errors across 8 pages × 375/768/1280/1920.
- **JS on / before interaction:** 275 KiB gz total (framework + app). GSAP and its plugins load lazily after hydration or near the viewport.
- **LCP caveat:** measured on localhost without a CDN. The mobile LCP target (< 2.5s on 4G) needs re-measuring on the Vercel deployment. If it misses, the first levers are dropping the h1 pre-dim (MotionRoot) and lowering the hero AVIF quality.

Screenshots of the final build are in `screenshots/final/` (375 and 1440). The "before" state is the client's 26 Oct screen captures of wanasis.dz.

## Vercel preview — 26 Oct 2026 (after `vercel.json` and the motion/LCP fix, commit 73c4ce4)

Lighthouse mobile, default throttling; best of 2 runs. Desktop scored 99–100 performance on every page before the fix.

| Route | LCP | CLS | TBT | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|---|---|---|
| / | 2.56s | 0 | 89ms | 97 | 100 | 100 | 61* |
| /wanasis-fusion-erp-modules/ | 3.00s | 0 | 128ms | 93 | 100 | 100 | 61* |
| /reference/ | 2.32s | 0 | 135ms | 97 | 100 | 100 | 61* |
| /actualites/ | 2.56s | 0 | 83ms | 97 | 100 | 100 | 61* |
| /le-mrp-pilier-…/ | 2.48s | 0 | 91ms | 97 | 100 | 100 | 61* |

Before the fix, the same preview scored perf 79 on / (TBT 621ms).

\* SEO 61 is preview-only. Vercel sends `x-robots-tag: noindex` on every preview deployment, and Lighthouse's own robots.txt fetch hits the deployment-protection login page. Both failing audits (`is-crawlable`, `robots-txt`) disappear on the production domain; the site's own SEO audits pass (100 locally).
