import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Blog posts authored as MDX. One file = one post; frontmatter holds the
// metadata that used to live in posts.ts. Prose is plain Markdown; the blog
// components (Callout, StatRow, …) are available as tags without importing
// (auto-injected at render time — see src/pages/blog/[...slug] demo route).
const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tag: z.string(),
    date: z.string(),
    // NB: not "slug" — that's a reserved content-collection field and would
    // collapse the en/ and zh/ entries that share a URL slug into one.
    postSlug: z.string(),
    // Locale is derived from the folder (en/ or zh/) via the entry id, so the
    // CMS never has to manage a per-locale `lang` field. See data/posts.ts.
    meta: z
      .array(z.object({ text: z.string(), href: z.string().optional() }))
      .default([]),
  }),
});

// Distill — zh-only daily curated picks, authored by the automated pipeline in
// ~/Documents/work/distill. Deliberately a separate collection so the
// hand-crafted Writing section is never flooded by daily posts. Spans multiple
// channels (data-engineering, money) filtered per-section via `channel`.
const distill = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/distill" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    postSlug: z.string(),
    sourceUrl: z.string(),
    sourceName: z.string().default(""),
    threadUrl: z.string().default(""),
    // 頻道分區（2026-07-24）：既有 12 篇無此欄，default 回填 data-engineering，
    // 各分區 index 頁據此過濾（資料工程選文 / 理財選文）。
    channel: z.enum(["data-engineering", "money"]).default("data-engineering"),
  }),
});

export const collections = { blog, distill };
