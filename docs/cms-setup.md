# Browser CMS setup (Sveltia CMS + Cloudflare Worker)

The CMS lives at **`/admin`**. Content is the MDX in `src/content/blog/{en,zh}/`.
Login is GitHub OAuth through a **self-hosted Cloudflare Worker** (free tier — no
third-party service touches the repo). Total cost: **$0**.

The in-repo parts (`public/admin/index.html`, `public/admin/config.yml`) are done.
The steps below need your GitHub + Cloudflare accounts.

---

## 0. Try the editor locally first — no accounts needed

`config.yml` has `local_backend: true`, so you can drive the real CMS UI against
your local files before setting up any auth:

```bash
# terminal A — auth/proxy shim (Sveltia is Decap-compatible)
npx decap-server
# terminal B — the site
npm run dev
```

Open <http://localhost:4321/admin/> → "Work with Local Repo". Edit a post, hit
save, then check `git diff`.

**Important round-trip check:** confirm the `<StatRow>` / `<DiffBlock>` /
`<CodeBlock>` blocks are byte-identical after a save. If the rich-text editor
reflowed them, change the `body` widget in `config.yml` from `markdown` to `text`
(a plain textarea — lossless for MDX). Prose editing stays fine either way.

---

## 1. Create a GitHub OAuth App

GitHub → Settings → Developer settings → **OAuth Apps** → **New OAuth App**

- **Application name:** `Sveltia CMS – myps6415.github.io`
- **Homepage URL:** `https://myps6415.github.io`
- **Authorization callback URL:** `https://<worker-url>/callback`
  (you'll have the worker URL after step 2 — you can edit this field afterwards)

Register → copy the **Client ID** → **Generate a new client secret** → copy it.

## 2. Deploy the OAuth Worker (Cloudflare, free)

Official worker: <https://github.com/sveltia/sveltia-cms-auth>

Easiest path is the repo's **Deploy to Cloudflare** button; or clone and
`npx wrangler deploy`. Then set these on the Worker (dashboard → the Worker →
Settings → Variables, or `wrangler secret put <NAME>`):

| Variable | Value |
|----------|-------|
| `GITHUB_CLIENT_ID` | from step 1 |
| `GITHUB_CLIENT_SECRET` | from step 1 |
| `ALLOWED_DOMAINS` | `myps6415.github.io` |

Note the Worker URL, e.g. `https://sveltia-cms-auth.<your-subdomain>.workers.dev`.
Go back to the GitHub OAuth App and set the **callback URL** to
`<worker-url>/callback`.

## 3. Wire it up

1. In `public/admin/config.yml`, set `base_url:` to your Worker URL.
2. Commit + push (deploys via GitHub Pages).
3. Open <https://myps6415.github.io/admin/> → **Login with GitHub** → edit.

---

## How it behaves

- **New post:** New entry → fill EN and ZH side by side. `postSlug` becomes the
  filename in *both* language folders; **Publish** commits to `main` → Pages
  rebuilds.
- **Locale = folder.** The CMS writes `src/content/blog/en/<postSlug>.mdx` and
  `.../zh/<postSlug>.mdx`; Astro derives the language from the folder.
- **Bilingual workflow:** write one language, let AI draft the other, review in
  the CMS.
- **Component blocks** (`StatRow`, `DiffBlock`, `CodeBlock`, …) appear as raw MDX
  in the editor — edit prose around them, leave the tags intact.
- **Cost / security:** Workers free tier is 100k req/day; login uses a handful, so
  $0/month. Only your own GitHub OAuth App and Worker can write to the repo.
