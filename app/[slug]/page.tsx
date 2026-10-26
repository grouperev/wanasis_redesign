import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/news/PostBody";
import { CategoryTag, PostCard } from "@/components/news/PostCard";
import { POSTS, imageUrl, postBySlug, related } from "@/components/news/posts";
import { pageMetadata } from "@/components/news/meta";
import { Picture } from "@/components/ui/Picture";
import { formatDate, frTypo } from "@/lib/format";
import { SITE } from "@/lib/site";

// Only the 35 post slugs exist here, so this segment never shadows another page.
export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    route: post.route,
    description: post.description,
    type: "article",
    image: imageUrl(post.cover),
    extra: { publishedTime: post.date, authors: [post.author], section: post.category },
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();
  const more = related(post);
  const cover = imageUrl(post.cover);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "fr-FR",
    articleSection: post.category,
    description: post.lead,
    mainEntityOfPage: `${SITE.url}${post.route}`,
    image: cover ? [cover.url] : undefined,
    author: { "@type": "Person", name: post.author },
    publisher: { "@id": `${SITE.url}/#organization` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <header className="brand-mesh-light bg-surface">
          <div className="container-x pb-10 pt-12 lg:pb-14 lg:pt-16">
            <Link href="/actualites/" className="inline-flex min-h-11 items-center gap-2 text-small font-medium text-teal-ink underline-offset-4 hover:underline">
              <span aria-hidden="true">←</span> Retour aux actualités
            </Link>
            <h1 data-reveal className="mt-6 max-w-[28ch] font-display text-h1">
              {frTypo(post.title)}
            </h1>
            <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-ink-2">
              <CategoryTag category={post.category} />
              <span>
                Publié le <time dateTime={post.date}>{formatDate(post.date)}</time> par {post.author}
              </span>
            </p>
          </div>
        </header>

        <div className="container-x">
          <Picture
            src={post.cover}
            alt=""
            sizes="(min-width: 1320px) 1240px, 100vw"
            priority
            className="block"
            imgClassName="aspect-[2/1] w-full rounded-lg bg-surface-2 object-cover"
          />
        </div>

        <div className="container-x py-[var(--section-y)]">
          <PostBody blocks={post.blocks} />
        </div>
      </article>

      <section aria-labelledby="a-lire-aussi" className="border-t border-hairline bg-surface-2">
        <div className="container-x py-[var(--section-y)]">
          <h2 id="a-lire-aussi" className="text-h2">
            À lire aussi
          </h2>
          <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
