import data from "@/lib/content/posts-full.json";
import images from "@/lib/content/images.json";
import { SITE } from "@/lib/site";

export type Block =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul" | "ol"; items: string[]; hrefs?: string[] }
  | { type: "img"; src: string; alt: string; w: number; h: number };

export type Post = {
  slug: string;
  route: string;
  title: string;
  date: string;
  author: string;
  category: "Article" | "News";
  cover: string;
  lead: string;
  description: string | null;
  blocks: Block[];
};

export const POSTS = data.posts as unknown as Post[];
export const PER_PAGE = data.perPage;
export const PAGES = data.pages;
export const PAGE_COUNT = Math.ceil(POSTS.length / PER_PAGE);
export const CATEGORIES = ["Article", "News"] as const;

export const postsIn = (category?: Post["category"]) => (category ? POSTS.filter((p) => p.category === category) : POSTS);
export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
export const pagePosts = (n: number) => POSTS.slice((n - 1) * PER_PAGE, n * PER_PAGE);
export const pageHref = (n: number) => (n <= 1 ? "/actualites/" : `/actualites/page/${n}/`);

/** Same category first, then the latest, never the post itself. */
export function related(post: Post, count = 3): Post[] {
  const others = POSTS.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, count);
}

type ManifestEntry = { name: string; width: number; height: number; widths: number[] };
const MANIFEST = images as Record<string, ManifestEntry>;

/** Absolute URL of the largest derivative of a registered image, for og:image / JSON-LD. */
export function imageUrl(file: string): { url: string; width: number; height: number } | null {
  const e = MANIFEST[file];
  if (!e) return null;
  const w = e.widths[e.widths.length - 1];
  return { url: `${SITE.url}/img/${e.name}-${w}.webp`, width: w, height: Math.round((e.height * w) / e.width) };
}
