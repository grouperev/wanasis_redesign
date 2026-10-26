import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import { formatDate, frTypo } from "@/lib/format";
import type { Post } from "./posts";

export function CategoryTag({ category }: { category: string }) {
  return <span className="rounded-xs bg-surface-2 px-2 py-0.5 font-display text-small uppercase tracking-[0.06em] text-teal-ink">{category}</span>;
}

/** Card for lists. The whole card is one link (stretched on the title); the date stays a real <time>. */
export function PostCard({ post, level = 3, eager = false }: { post: Post; level?: 2 | 3; eager?: boolean }) {
  const H = `h${level}` as "h2" | "h3";
  return (
    <article className="group relative flex h-full flex-col" data-category={post.category}>
      <div className="overflow-hidden rounded-md bg-surface-2">
        <Picture
          src={post.cover}
          alt=""
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          priority={eager}
          className="block"
          imgClassName="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-ink-2">
        <CategoryTag category={post.category} />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </p>
      <H className="mt-3 text-h3">
        <Link href={post.route} className="after:absolute after:inset-0 hover:text-teal-ink">
          {frTypo(post.title)}
        </Link>
      </H>
      <p className="mt-3 line-clamp-3 text-ink-2">{frTypo(post.lead)}</p>
    </article>
  );
}

/** Large card for the latest post: image left, text right from lg. */
export function FeaturedPost({ post }: { post: Post }) {
  return (
    <article className="group relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12" data-category={post.category}>
      <div className="overflow-hidden rounded-lg bg-surface-2 lg:col-span-7">
        <Picture
          src={post.cover}
          alt=""
          sizes="(min-width: 1024px) 760px, 100vw"
          priority
          className="block"
          imgClassName="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
      <div className="lg:col-span-5">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-ink-2">
          <CategoryTag category={post.category} />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <h2 className="mt-4 text-h2">
          <Link href={post.route} className="after:absolute after:inset-0 hover:text-teal-ink">
            {frTypo(post.title)}
          </Link>
        </h2>
        <p className="mt-5 text-lead text-ink-2">{frTypo(post.lead)}</p>
      </div>
    </article>
  );
}
