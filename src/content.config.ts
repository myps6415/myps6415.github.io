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
    lang: z.enum(["en", "zh"]).default("en"),
    meta: z
      .array(z.object({ text: z.string(), href: z.string().optional() }))
      .default([]),
  }),
});

export const collections = { blog };
