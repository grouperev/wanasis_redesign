import { NewsIndex } from "@/components/news/NewsIndex";
import { pageMetadata } from "@/components/news/meta";
import { PAGES } from "@/components/news/posts";

export const metadata = pageMetadata({ title: PAGES.news.title, route: PAGES.news.route, description: PAGES.news.description });

export default function NewsPage() {
  return <NewsIndex category="News" />;
}
