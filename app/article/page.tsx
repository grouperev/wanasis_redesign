import { NewsIndex } from "@/components/news/NewsIndex";
import { pageMetadata } from "@/components/news/meta";
import { PAGES } from "@/components/news/posts";

export const metadata = pageMetadata({ title: PAGES.article.title, route: PAGES.article.route, description: PAGES.article.description });

export default function ArticlePage() {
  return <NewsIndex category="Article" />;
}
