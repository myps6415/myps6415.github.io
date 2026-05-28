import type { Locale } from "../i18n/strings";

export interface PostLocale {
  title: string;
  description: string;
  tag: string;
}

export interface Post {
  slug: string;
  date: string;
  en: PostLocale;
  zh: PostLocale;
}

export const posts: Post[] = [
  {
    slug: "openclaw-issue87291-postmortem",
    date: "2026-05-28",
    en: {
      title:
        "How to write an issue so good someone else sends the PR",
      description:
        "A silent 500-character truncation in OpenClaw's reply-context handler. I filed the issue; someone else opened the PR.",
      tag: "Postmortem · Open Source",
    },
    zh: {
      title: "把 issue 寫到好到讓別人替你送 PR",
      description:
        "OpenClaw 回覆上下文處理裡一個無聲的 500 字元截斷 bug — 我寫了 issue，別人送了 PR。",
      tag: "Postmortem · 開源貢獻",
    },
  },
  {
    slug: "openclaw-pr84890-postmortem",
    date: "2026-05-22",
    en: {
      title:
        "Fixing a deadlock that kept OpenClaw Gateway from restarting after upgrade",
      description:
        "An ESM dynamic import, a signal handler, and a race condition — the gateway broke silently for six days.",
      tag: "Postmortem · Open Source",
    },
    zh: {
      title: "修掉一個讓 OpenClaw Gateway 升級後永遠不重啟的 deadlock",
      description:
        "一個 ESM dynamic import、一個 signal handler、一個 race condition，讓 gateway 悄悄壞掉六天。",
      tag: "Postmortem · 開源貢獻",
    },
  },
];

export function postPath(slug: string, lang: Locale): string {
  return lang === "zh" ? `/zh/blog/${slug}` : `/blog/${slug}`;
}

export function blogIndexPath(lang: Locale): string {
  return lang === "zh" ? "/zh/blog/" : "/blog/";
}
