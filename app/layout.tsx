import type { Metadata, Viewport } from "next";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MobileBar } from "@/components/site/MobileBar";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Wanasis Fusion : L'ERP de choix pour les entreprises en Algérie", template: "%s" },
  description:
    "Vous recherchez un ERP en Algérie ? Wanasis Fusion ERP est le choix idéal, éprouvé aussi bien en Algérie qu'à l'international.",
  openGraph: { locale: "fr_FR", siteName: "Wanasis", type: "website" },
};

export const viewport: Viewport = { themeColor: "#00324B" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preload" href="/fonts/d-din-400.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-surface focus:px-4 focus:py-2 focus:shadow-e2">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <MobileBar />
        <MotionRoot />
      </body>
    </html>
  );
}
