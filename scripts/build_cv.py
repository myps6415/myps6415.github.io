#!/usr/bin/env python3
"""Render the bilingual one-page résumé from a YAML source.

Public CV (default):
    python3 scripts/build_cv.py            # cv/resume.yaml -> public/cv/index.html + public/zh/cv/index.html
    python3 scripts/build_cv.py --pdf      # also prints both to cv/dist/resume-{en,zh}.pdf

Job-type variants (cv/variants/, gitignored — never published; meta.template may point
at a variant's own layout, e.g. variants/micron.html.j2):
    python3 scripts/build_cv.py --source cv/variants/platform.yaml --pdf
        -> cv/dist/platform/index-{en,zh}.html + resume-platform-{en,zh}.pdf

A variant never writes into public/: only cv/resume.yaml feeds the live site.
--pdf needs playwright (pip install playwright && playwright install chromium).

Dependencies: pyyaml, jinja2  (pip install pyyaml jinja2)
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader, StrictUndefined

ROOT = Path(__file__).resolve().parent.parent
CV = ROOT / "cv"
PUBLIC_SOURCE = CV / "resume.yaml"
PUBLIC_OUT = {"en": ROOT / "public" / "cv" / "index.html", "zh": ROOT / "public" / "zh" / "cv" / "index.html"}
LANGS = ("en", "zh")


def make_t(lang: str):
    def t(value):
        if isinstance(value, dict):
            if lang not in value:
                raise KeyError(f"missing '{lang}' in {value!r}")
            return value[lang]
        return value
    return t


DEFAULT_TEMPLATE = "template.html.j2"


def template_of(data: dict) -> str:
    """A variant may set meta.template (path relative to cv/) to use its own layout."""
    return (data.get("meta") or {}).get("template", DEFAULT_TEMPLATE)


def render(lang: str, data: dict) -> str:
    env = Environment(loader=FileSystemLoader(CV), undefined=StrictUndefined, autoescape=False,
                      trim_blocks=True, lstrip_blocks=True)
    env.filters["t"] = make_t(lang)
    return env.get_template(template_of(data)).render(lang=lang, **data)


def to_pdf(html_paths: dict[str, Path], pdf_paths: dict[str, Path]) -> None:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        sys.exit("--pdf needs playwright: pip install playwright && playwright install chromium")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        for lang, path in html_paths.items():
            out = pdf_paths[lang]
            out.parent.mkdir(parents=True, exist_ok=True)
            page.goto(path.resolve().as_uri(), wait_until="networkidle")
            page.pdf(path=str(out), format="A4", prefer_css_page_size=True, print_background=True)
            print(f"  pdf  {out.relative_to(ROOT)}")
        browser.close()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", type=Path, default=PUBLIC_SOURCE,
                    help="YAML to render (default: cv/resume.yaml, the public CV)")
    ap.add_argument("--out", type=Path, default=None,
                    help="output dir for a variant (default: cv/dist/<source name>)")
    ap.add_argument("--pdf", action="store_true", help="also export PDFs")
    args = ap.parse_args()

    source = args.source if args.source.is_absolute() else (Path.cwd() / args.source)
    source = source.resolve()
    if not source.is_file():
        sys.exit(f"source not found: {source}")
    is_public = source == PUBLIC_SOURCE.resolve()

    if is_public:
        if args.out is not None:
            sys.exit("--out is only for variants; the public CV always writes to public/")
        html = PUBLIC_OUT
        pdfs = {lang: CV / "dist" / f"resume-{lang}.pdf" for lang in LANGS}
    else:
        name = source.stem
        out_dir = (args.out or (CV / "dist" / name)).resolve()
        if (ROOT / "public").resolve() in out_dir.parents or out_dir == (ROOT / "public").resolve():
            sys.exit("refusing to write a variant into public/: only cv/resume.yaml is published")
        html = {lang: out_dir / f"index-{lang}.html" for lang in LANGS}
        pdfs = {lang: out_dir / f"resume-{name}-{lang}.pdf" for lang in LANGS}

    data = yaml.safe_load(source.read_text(encoding="utf-8"))
    if is_public and template_of(data) != DEFAULT_TEMPLATE:
        sys.exit("cv/resume.yaml must use the default template (meta.template is for variants)")
    for lang, out in html.items():
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render(lang, data), encoding="utf-8")
        print(f"  html {out.relative_to(ROOT)}")
    if args.pdf:
        to_pdf(html, pdfs)
    if not is_public:
        remind_variant(source, args.pdf)


def remind_variant(source: Path, built_pdf: bool) -> None:
    """Variants live in their own private repo (cv/variants) — easy to forget to save or record."""
    variants = CV / "variants"
    if (variants / ".git").exists():
        status = subprocess.run(["git", "-C", str(variants), "status", "--porcelain"],
                                capture_output=True, text=True).stdout.strip()
        if status:
            print("\n  ! cv/variants has uncommitted changes — commit and push them (private repo cv-variants)")
    else:
        print("\n  ! cv/variants is not a git repo — clone myps6415/cv-variants into it so variants are backed up")
    name = source.stem
    if built_pdf:
        print(f"  → after you send it: python3 scripts/cv_submit.py {name}")
    else:
        print("  → add --pdf to get the PDFs you would send")


if __name__ == "__main__":
    main()
