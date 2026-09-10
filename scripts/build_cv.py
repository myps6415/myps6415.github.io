#!/usr/bin/env python3
"""Render the bilingual one-page résumé from cv/resume.yaml.

    python3 scripts/build_cv.py            # writes public/cv/index.html + public/zh/cv/index.html
    python3 scripts/build_cv.py --pdf      # also prints both to cv/dist/*.pdf via headless Chromium (needs playwright)

Dependencies: pyyaml, jinja2  (pip install pyyaml jinja2)
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader, StrictUndefined

ROOT = Path(__file__).resolve().parent.parent
CV = ROOT / "cv"
OUT = {"en": ROOT / "public" / "cv" / "index.html", "zh": ROOT / "public" / "zh" / "cv" / "index.html"}


def make_t(lang: str):
    def t(value):
        if isinstance(value, dict):
            if lang not in value:
                raise KeyError(f"missing '{lang}' in {value!r}")
            return value[lang]
        return value
    return t


def render(lang: str, data: dict) -> str:
    env = Environment(loader=FileSystemLoader(CV), undefined=StrictUndefined, autoescape=False,
                      trim_blocks=True, lstrip_blocks=True)
    env.filters["t"] = make_t(lang)
    return env.get_template("template.html.j2").render(lang=lang, **data)


def to_pdf(html_paths: dict[str, Path]) -> None:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        sys.exit("--pdf needs playwright: pip install playwright && playwright install chromium")
    dist = CV / "dist"
    dist.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        for lang, path in html_paths.items():
            page.goto(path.resolve().as_uri(), wait_until="networkidle")
            out = dist / f"resume-{lang}.pdf"
            page.pdf(path=str(out), format="A4", prefer_css_page_size=True, print_background=True)
            print(f"  pdf  {out.relative_to(ROOT)}")
        browser.close()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", action="store_true", help="also export PDFs to cv/dist/")
    args = ap.parse_args()

    data = yaml.safe_load((CV / "resume.yaml").read_text(encoding="utf-8"))
    for lang, out in OUT.items():
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render(lang, data), encoding="utf-8")
        print(f"  html {out.relative_to(ROOT)}")
    if args.pdf:
        to_pdf(OUT)


if __name__ == "__main__":
    main()
