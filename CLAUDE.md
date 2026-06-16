# CLAUDE.md

Astro 5 + Tailwind 4 static site deployed to GitHub Pages at `https://myps6415.github.io`. Bilingual portfolio + `Writing` blog for John Tung / 童曉瑜.

## Commands

- `npm run dev` — dev server on `:4321`
- `npm run build` — static build into `dist/`
- `npm run preview` — preview the built output

## i18n

- Config in `astro.config.mjs`: `prefixDefaultLocale: false`. EN lives at `/`, ZH at `/zh/`.
- Every EN page has a `/zh/…` twin. Both render through the same components and pull copy from `src/i18n/strings.ts` (keyed by `en` / `zh` — single source of truth for all homepage copy).
- `LanguageToggle` in `Base.astro` defaults to home (`/` ↔ `/zh/`). Pages outside that pair (blog post, blog index) must pass `alternateUrls={{ en, zh }}` to `Base`; it propagates to both `hreflang` tags and the toggle. `BlogPost.astro` derives this automatically from the post slug.

## Source layout

```
src/
  layouts/
    Base.astro             # html shell: hreflang, fonts, LanguageToggle, slot
    BlogPost.astro         # blog wrapper; computes alternateUrls per slug
  components/
    Hero, About, SelectedWork, Writing, Now, Connect, Section, LanguageToggle
    blog/
      Callout, StatRow, Timeline, Flow, DiffBlock, Lesson, CodeBlock
  i18n/strings.ts          # homepage copy, both locales (single source of truth)
  data/posts.ts            # blog post metadata, both locales (single source of truth)
  pages/
    index.astro            # EN home
    blog/
      index.astro          # EN blog index
      <slug>.astro         # EN post
    zh/
      index.astro          # ZH home
      blog/
        index.astro
        <slug>.astro
  styles/global.css        # @theme tokens + .blog-prose styles
```

## Adding a new blog post

1. Add a `Post` entry to `src/data/posts.ts` (slug, date, en/zh `title`/`description`/`tag`).
2. Create `src/pages/blog/<slug>.astro` and `src/pages/zh/blog/<slug>.astro`. Use the existing OpenClaw post as a template — both files wrap content in `<BlogPost>` and pull metadata via `posts.find(p => p.slug === "<slug>")`.
3. Done. The homepage `Writing` section and `/blog/`, `/zh/blog/` index pages auto-render from `posts.ts`.

## `/cv` one-pager (job-hunt leave-behind)

A standalone bilingual one-pager in `public/`, served verbatim by Astro (not part of the Astro page pipeline):

- `public/cv/index.html` — EN, served at `/cv`
- `public/zh/cv/index.html` — ZH, served at `/zh/cv`

Deliberately **not** the site design system:

- Self-contained HTML with its own inline CSS — IBM Plex Sans TC / Mono and a green accent (`--accent:#1C6B57`), not Geist/orange. It's an intentional standalone artifact; don't fold it into `Base.astro` or restyle it to match the site.
- Has `@media print` styles — it doubles as a PDF leave-behind for recruiters.
- Language switch is a plain top-right `.lang` link (EN ↔ ZH), not the site `LanguageToggle`. `hreflang` (en / zh-Hant / x-default) is hardcoded in each file's `<head>`.
- The two locale files are **hand-kept in sync** (no shared source) — edit both when content changes. EN `Writing` links point to `/blog/<slug>`, ZH to `/zh/blog/<slug>`.

Work-experience claims are anonymized (no employer named — this repo is public) and are fact-checked against local source repos before each change. Which repos, plus known fact gotchas (e.g. claims that look shippable but aren't), live in private session memory, not here.

## Design tokens

Defined in `src/styles/global.css` under `@theme`:

- Color ramp: `--color-ink-50` (lightest) → `--color-ink-900` (darkest), plus `--color-accent` (orange).
- Fonts: Geist (sans), Geist Mono (mono), Noto Sans TC (Chinese fallback).
- Body `text-ink-700`, headings `text-ink-900`, muted labels/dates `text-ink-500`.
- Heading style: `font-semibold tracking-tight`. Label/eyebrow style: `font-mono text-[11px] uppercase tracking-widest text-ink-500`.

`.blog-prose` in `global.css` styles the markdown-ish slot inside `BlogPost.astro` (h2/h3/p/code/ul). Custom blog components (Callout, Timeline, …) are imported and used inline as Astro components, not as markdown plugins.

## Conventions / non-obvious choices

- **No content collections, no MDX.** Posts are plain `.astro` pages composing the components in `src/components/blog/`. For one or two locales this is simpler than MDX/collections; adding a third locale would justify rework.
- **Light theme only** for blog components. The original draft postmortem (the standalone HTML that was at repo root) used a dark theme — that was a one-off and has been migrated. Don't reintroduce it.
- Code blocks have no syntax highlighting (no shiki/prism). If a post really needs it, add a CodeBlock variant — don't change the default.

## Related repos

- `github.com/myps6415/myps6415` — GitHub profile README (separate repo, lives at `~/Documents/work/myps6415`). Cross-links to specific blog posts when relevant.
