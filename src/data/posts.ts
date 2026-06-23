import { getCollection } from "astro:content";
import type { Locale } from "../i18n/strings";

export interface PostMeta {
  slug: string;
  date: string;
  title: string;
  description: string;
  tag: string;
  meta: { text: string; href?: string }[];
}

// Posts are authored as MDX in src/content/blog/{en,zh}/<slug>.mdx (one file
// per locale, sharing a slug). This returns the given locale's posts, newest
// first — the single source of truth for the homepage Writing section and the
// blog index pages.
export async function getSortedPosts(lang: Locale): Promise<PostMeta[]> {
  // locale is the entry's top folder: "en/<slug>" or "zh/<slug>"
  const entries = await getCollection("blog", (e) => e.id.startsWith(`${lang}/`));
  return entries
    .map((e) => ({
      slug: e.data.postSlug,
      date: e.data.date,
      title: e.data.title,
      description: e.data.description,
      tag: e.data.tag,
      meta: e.data.meta,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function postPath(slug: string, lang: Locale): string {
  return lang === "zh" ? `/zh/blog/${slug}` : `/blog/${slug}`;
}

export function blogIndexPath(lang: Locale): string {
  return lang === "zh" ? "/zh/blog/" : "/blog/";
}
