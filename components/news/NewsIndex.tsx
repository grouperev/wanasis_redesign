import { frTypo } from "@/lib/format";
import { CategoryNav } from "./CategoryNav";
import { NewsList, type NewsItem } from "./NewsList";
import { Pagination } from "./Pagination";
import { FeaturedPost, PostCard } from "./PostCard";
import { CATEGORIES, PAGES, pagePosts, postsIn, type Post } from "./posts";

/** /actualites/ (page 1 = featured + grid), /actualites/page/N/ (grid) and the category archives. */
export function NewsIndex({ page, category }: { page?: number; category?: Post["category"] }) {
  const meta = category ? (category === "Article" ? PAGES.article : PAGES.news) : PAGES.actualites;
  const posts = category ? postsIn(category) : pagePosts(page ?? 1);
  const firstOfPage = !category && (page ?? 1) === 1;

  // Only the first post of each category can become the featured one once a chip is toggled.
  const seen = new Set<string>();
  const items: NewsItem[] = posts.map((p, idx) => {
    const canFeature = firstOfPage && (idx === 0 || !seen.has(p.category));
    seen.add(p.category);
    return {
      slug: p.slug,
      category: p.category,
      card: <PostCard post={p} eager={idx < 2} />,
      featured: canFeature ? <FeaturedPost post={p} /> : undefined,
    };
  });

  return (
    <>
      <section className="brand-mesh-light bg-surface">
        <div className="container-x pb-8 pt-16 lg:pt-24">
          <h1 data-reveal className="font-display text-h1">
            {frTypo(meta.h1)}
          </h1>
          {category && (
            <div className="mt-10">
              <CategoryNav current={category} />
            </div>
          )}
        </div>
      </section>
      <section className="container-x pb-[var(--section-y)]" aria-label={meta.h1}>
        {category ? (
          <ul className="grid gap-x-8 gap-y-14 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, idx) => (
              <li key={p.slug}>
                <PostCard post={p} eager={idx < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <NewsList items={items} categories={[...CATEGORIES]} featureFirst={firstOfPage} />
            <Pagination current={page ?? 1} />
          </div>
        )}
      </section>
    </>
  );
}
