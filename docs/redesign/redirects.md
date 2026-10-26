# Redirect map (WordPress → Next.js)

Every crawled route (`routes.txt`) is served at the same URL, so none of them needs a redirect. Only these legacy URLs are redirected (301, `next.config.ts`):

| From | To | Why |
|---|---|---|
| `/wanasis-erp-modules/` | `/wanasis-fusion-erp-modules/` | dead link on the old home page (404) |
| `/sitemap_index.xml`, `/wp-sitemap.xml` | `/sitemap.xml` | Yoast/WP sitemap URLs already known to Google |
| `/feed/` | `/actualites/` | WP RSS feed |

Not migrated: `/wp-content/uploads/*` media URLs. If other sites hotlink those images, keep the old host alive or add rewrites after launch.
