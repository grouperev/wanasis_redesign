import type { NextConfig } from "next";

// Static export. trailingSlash mirrors WordPress URLs (/contact/ → out/contact/index.html).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
