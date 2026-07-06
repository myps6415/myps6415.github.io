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
  content.config.ts        # `blog` collection schema (glob loader over src/content/blog)
  content/blog/
    en/<postSlug>.mdx      # EN posts: frontmatter + Markdown + component tags
    zh/<postSlug>.mdx      # ZH twin (same postSlug = shared URL slug; locale = folder)
  content/distill/
    <postSlug>.mdx         # Distill daily picks (zh-only, machine-written — see "Distill section")
  i18n/strings.ts          # homepage copy, both locales (single source of truth)
  data/posts.ts            # getSortedPosts(lang) + postPath/blogIndexPath helpers
  pages/
    index.astro            # EN home
    blog/
      index.astro          # EN blog index (getSortedPosts('en'))
      [slug].astro         # renders every EN post from the collection
    zh/
      index.astro          # ZH home
      blog/
        index.astro
        [slug].astro       # renders every ZH post
      distill/
        index.astro        # Distill picks index (zh-only)
        [slug].astro       # renders every distill pick via Base (not BlogPost)
  styles/global.css        # @theme tokens + .blog-prose styles
public/
  admin/                   # Sveltia CMS (browser editor) — see "Browser CMS"
```

## Adding a new blog post

Two files — one per locale — in the content collection. No `posts.ts` edit, no per-page `.astro`.

1. Create `src/content/blog/en/<slug>.mdx` and `src/content/blog/zh/<slug>.mdx`.
2. Frontmatter (YAML): `title`, `description`, `tag`, `date` (a `"YYYY-MM-DD"` **string**), `postSlug` (the URL slug), and optional `meta` (list of `{ text, href? }`). 
   - **The slug field MUST be `postSlug`, not `slug`** — `slug` is a reserved content-collection field and would collapse the two locale entries (same slug) into one, dropping posts nondeterministically. (This bug is the subject of the `migrating-to-mdx` post.)
   - **Do NOT add `lang`** — locale is derived from the `en/` | `zh/` folder (`getSortedPosts` and the `[slug]` routes filter on the entry id prefix).
3. Body is Markdown. Use the blog components as tags — `<StatRow .../>`, `<CodeBlock>…</CodeBlock>`, `<DiffBlock .../>`, etc. — with **no imports** (the `[slug].astro` routes auto-inject them via `<Content components={...} />`). Raw code goes inside `<CodeBlock>{`…`}</CodeBlock>` template literals; never reflow it. In Chinese, `**粗體**` works (see `remark-cjk-friendly` under Conventions).
4. `npm run build`, commit, push. The homepage `Writing` section, both `/blog/` indexes, and the `[slug]` routes auto-render from the collection (newest first by `date`).

Or create/edit posts in the browser at `/admin` (see Browser CMS) — same files, either path.

## Distill section (`/zh/distill/`) — machine-written, do not hand-edit routinely

Daily curated data-engineering picks (350–380字 zh rewrites), auto-committed to `main`
by the Distill pipeline (`~/.openclaw/scripts/publish_to_pages.py`, runs 07:30 daily
after the Threads publish; project docs in `~/Documents/work/distill/`).

- **Separate `distill` collection** (see `content.config.ts`) — deliberately NOT in
  `blog`, so daily posts never flood the homepage Writing section or `/blog/` indexes.
- zh-only: no EN twin. The routes pass explicit `alternateUrls` with `en: "/"` so
  hreflang falls back to the home pair; `[slug].astro` here renders via `Base`
  directly, NOT `BlogPost` (that layout derives an EN twin URL that wouldn't exist).
- Frontmatter: `title`, `description`, `date`, `postSlug`, `sourceUrl`, and optional
  `sourceName` / `threadUrl`. Body is plain paragraphs with `{`/`<` HTML-escaped by
  the generator.
- The pipeline commits straight to `main` — `git pull` before local work, same as
  the CMS caveat. If a generated post breaks the build, delete its `.mdx` and the
  pipeline will not regenerate it (slug-exists guard); fix the generator instead.

Sveltia CMS (Decap-compatible) at `/admin`, for editing posts in a browser without touching git. It reads/writes the **same** MDX files — an *additional* authoring path, not a replacement. Editing in-repo (Claude / VS Code / Obsidian) still works exactly the same; both operate on `src/content/blog/`.

- `public/admin/index.html` loads Sveltia pinned to an immutable version (`@sveltia/cms@x.y.z` — not floating `@latest`, since this page holds a repo-scoped token). `public/admin/config.yml` defines the `blog` collection with i18n `multiple_folders` mapping onto `en/` | `zh/`, and `postSlug` as the shared filename.
- GitHub login goes through a self-hosted Cloudflare Worker (`sveltia-cms-auth`); `base_url` in `config.yml` points to it. The Worker holds the OAuth client secret + `ALLOWED_DOMAINS`; **nothing sensitive is in the repo**. Full setup + the callback-URL gotcha: `docs/cms-setup.md`.
- Caveat: the rich-text editor can reflow component blocks (`<StatRow>`, `<CodeBlock>`, …). If a CMS save mangles them, switch the `body` widget in `config.yml` from `markdown` to `text`. Prose editing is safe.
- Don't edit the same post simultaneously in the CMS and in git — the CMS commits to `main`, so `git pull` before editing locally.

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

`.blog-prose` in `global.css` styles the Markdown rendered inside `BlogPost.astro` (h2/h3/p/code/ul). Custom blog components (Callout, Timeline, …) are used as tags inside the MDX body and auto-injected by the `[slug]` routes — not imported per-post, not markdown plugins.

## Conventions / non-obvious choices

- **MDX content collections** (migrated 2026-06 from per-page `.astro`; the migration + its bugs are the `migrating-to-mdx` post). Posts are `src/content/blog/{en,zh}/<postSlug>.mdx`, rendered by `src/pages/**/blog/[slug].astro`. Gotchas worth remembering: the URL-slug frontmatter key is **`postSlug`** (the bare `slug` is reserved and silently collapses locale pairs); **`remark-cjk-friendly`** in `astro.config.mjs` is required so `**粗體**`/`*斜體*` parse next to CJK characters; smartypants turns straight quotes curly (intended).
- **Light theme only** for blog components. The original draft postmortem (the standalone HTML that was at repo root) used a dark theme — that was a one-off and has been migrated. Don't reintroduce it.
- Code blocks have no syntax highlighting (no shiki/prism). If a post really needs it, add a CodeBlock variant — don't change the default.

## Related repos

- `github.com/myps6415/myps6415` — GitHub profile README (separate repo, lives at `~/Documents/work/myps6415`). Cross-links to specific blog posts when relevant.
