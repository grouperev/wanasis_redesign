import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsIndex } from "@/components/news/NewsIndex";
import { pageMetadata } from "@/components/news/meta";
import { PAGES, PAGE_COUNT, pageHref } from "@/components/news/posts";

// The old WordPress archive paginated at /actualites/page/2/ … /page/4/; these URLs keep working.
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: PAGE_COUNT - 1 }, (_, i) => ({ n: String(i + 2) }));
}

type Props = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  return pageMetadata({ title: PAGES.actualites.title, route: pageHref(Number(n)), description: PAGES.actualites.description });
}

export default async function ActualitesPageN({ params }: Props) {
  const { n } = await params;
  const page = Number(n);
  if (!Number.isInteger(page) || page < 2 || page > PAGE_COUNT) notFound();
  return <NewsIndex page={page} />;
}
