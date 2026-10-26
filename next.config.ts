import type { NextConfig } from "next";

// Hosted on Vercel. Every page is prerendered at build time; the only server code is the form
// endpoint (app/api/forms). trailingSlash mirrors the WordPress URLs (/contact/).
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Legacy WordPress URLs (redirect map: docs/redesign/redirects.md).
  async redirects() {
    return [
      { source: "/wanasis-erp-modules/", destination: "/wanasis-fusion-erp-modules/", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/feed/", destination: "/actualites/", permanent: true },
    ];
  },
};

export default nextConfig;
