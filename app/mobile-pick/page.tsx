import type { Metadata } from "next";
import { MobileAppPage } from "@/components/product/MobileAppPage";
import mobile from "@/lib/content/mobile.json";

const { meta } = mobile.pick;

export const metadata: Metadata = {
  title: meta.title,
  alternates: { canonical: meta.canonical },
  openGraph: { title: meta.title, url: meta.canonical, locale: "fr_FR", type: "article" },
};

export default function MobilePickPage() {
  return <MobileAppPage slug="pick" />;
}
