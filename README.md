# myps6415.github.io

Source for [myps6415.github.io](https://myps6415.github.io) — personal landing page.

Astro 5 + Tailwind 4, deployed to GitHub Pages via GitHub Actions.

## Content

Blog posts are MDX in `src/content/blog/{en,zh}/<slug>.mdx` — one file per
locale, rendered through the `[slug]` routes. Edit them in the repo, or in the
browser at `/admin` (Sveltia CMS; setup in [`docs/cms-setup.md`](docs/cms-setup.md)).

## Local development

```sh
npm install
npm run dev
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
Astro and publishes via the official `actions/deploy-pages` action.
