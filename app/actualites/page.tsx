import { NewsIndex } from "@/components/news/NewsIndex";
import { pageMetadata } from "@/components/news/meta";
import { PAGES } from "@/components/news/posts";

export const metadata = pageMetadata({ title: PAGES.actualites.title, route: PAGES.actualites.route, description: PAGES.actualites.description });

export default function ActualitesPage() {
  return <NewsIndex page={1} />;
}
