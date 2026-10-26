import type { MetadataRoute } from "next";
import posts from "@/lib/content/posts.json";
import { SITE } from "@/lib/site";

const PAGES = [
  "/",
  "/erp-agerie-team/",
  "/wanasis-fusion-erp-modules/",
  "/erp-algerie-fusion/",
  "/wanasis-life-his/",
  "/mobile-view/",
  "/mobile-link/",
  "/mobile-pick/",
  "/mobile-ship/",
  "/reference/",
  "/actualites/",
  "/contact/",
  "/demande-de-brochure/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...posts.map((p) => ({ url: `${SITE.url}${p.route}`, lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
