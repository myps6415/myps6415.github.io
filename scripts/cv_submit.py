#!/usr/bin/env python3
"""Record a résumé you actually sent, in the private cv/variants repo.

    python3 scripts/cv_submit.py delta-esg              # today's date, both languages found, commit + push
    python3 scripts/cv_submit.py delta-esg --date 2026-11-20
    python3 scripts/cv_submit.py delta-esg --dry-run    # show what would happen

Copies cv/dist/<name>/resume-<name>-{zh,en}.pdf to cv/variants/submitted/<date>-<name>-<lang>.pdf,
then commits the PDFs together with the variant's source in cv/variants and pushes.
Refuses if the PDF is older than its YAML (rebuild first) or if the target file already exists.
"""
from __future__ import annotations

import argparse
import datetime as dt
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VARIANTS = ROOT / "cv" / "variants"
DIST = ROOT / "cv" / "dist"


def git(*args: str) -> str:
    return subprocess.run(["git", "-C", str(VARIANTS), *args], check=True,
                          capture_output=True, text=True).stdout


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("name", help="variant name, e.g. delta-esg (cv/variants/<name>.yaml)")
    ap.add_argument("--date", default=dt.date.today().isoformat(), help="date sent, YYYY-MM-DD (default: today)")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--no-push", action="store_true", help="commit but do not push")
    args = ap.parse_args()

    dt.date.fromisoformat(args.date)
    if not (VARIANTS / ".git").exists():
        sys.exit("cv/variants is not a git repo — clone myps6415/cv-variants into it first (see its README)")
    source = VARIANTS / f"{args.name}.yaml"
    if not source.is_file():
        sys.exit(f"no such variant: {source.relative_to(ROOT)}")

    pdfs = {lang: DIST / args.name / f"resume-{args.name}-{lang}.pdf" for lang in ("zh", "en")}
    pdfs = {lang: p for lang, p in pdfs.items() if p.is_file()}
    if not pdfs:
        sys.exit(f"no PDFs in {(DIST / args.name).relative_to(ROOT)} — run: "
                 f"python3 scripts/build_cv.py --source cv/variants/{args.name}.yaml --pdf")
    stale = [lang for lang, p in pdfs.items() if p.stat().st_mtime < source.stat().st_mtime]
    if stale:
        sys.exit(f"PDF ({', '.join(stale)}) is older than {source.name} — rebuild first, so the record matches what you sent")

    submitted = VARIANTS / "submitted"
    targets = {lang: submitted / f"{args.date}-{args.name}-{lang}.pdf" for lang in pdfs}
    clash = [t for t in targets.values() if t.exists()]
    if clash:
        sys.exit("already recorded: " + ", ".join(str(t.relative_to(ROOT)) for t in clash))

    for lang, src in pdfs.items():
        print(f"  {src.relative_to(ROOT)} -> {targets[lang].relative_to(ROOT)}")
    if args.dry_run:
        print("dry run: nothing copied, committed or pushed")
        return

    submitted.mkdir(exist_ok=True)
    for lang, src in pdfs.items():
        shutil.copy2(src, targets[lang])
    paths = [str(t.relative_to(VARIANTS)) for t in targets.values()] + [source.name]
    template = VARIANTS / f"{args.name}.html.j2"
    if template.exists():
        paths.append(template.name)
    git("add", "--", *paths)
    git("commit", "-m", f"submit: {args.name} ({args.date})")
    print(f"  committed in cv/variants: submit: {args.name} ({args.date})")
    if args.no_push:
        print("  not pushed (--no-push)")
        return
    try:
        git("push")
        print("  pushed")
    except subprocess.CalledProcessError as e:
        sys.exit(f"commit is in place but push failed — run `git -C cv/variants push` yourself\n{e.stderr}")


if __name__ == "__main__":
    main()
