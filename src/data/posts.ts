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
    slug: "null-not-zero",
    date: "2026-06-23",
    en: {
      title: "The fake zero: when a missing value must be NULL, not 0",
      description:
        "An Instagram analytics chart flatlined to zero while the follower count kept climbing. The bug wasn't missing data — it was a fake 0 written where NULL belonged.",
      tag: "Postmortem · Data Engineering",
    },
    zh: {
      title: "假的零：當缺值該存 NULL、不該存 0",
      description:
        "一張 IG 分析圖在粉絲數持續上升時卻歸零躺平。問題不是沒資料——是把該存 NULL 的地方，存成了假的 0。",
      tag: "Postmortem · 資料工程",
    },
  },
  {
    slug: "llm-in-the-warehouse",
    date: "2026-06-18",
    en: {
      title: "Running an LLM in BigQuery without the bill scaling with users",
      description:
        "Two features in my pipeline call Gemini through BigQuery AI.GENERATE — a batch classifier and an on-demand dashboard button. One of them quietly scales with headcount. Here's how I capped both.",
      tag: "Cost discipline · LLM",
    },
    zh: {
      title: "把 LLM 跑在 BigQuery，又不讓帳單隨使用者膨脹",
      description:
        "我 pipeline 裡有兩個功能透過 BigQuery AI.GENERATE 呼叫 Gemini——一個批次分類器、一個 dashboard 上即點即用的按鈕。其中一個會悄悄隨人數膨脹。這是我把兩個都壓平的方法。",
      tag: "成本紀律 · LLM",
    },
  },
  {
    slug: "from-n8n-zeabur-to-openclaw-local",
    date: "2026-06-10",
    en: {
      title:
        "Replacing a $7.88/mo n8n on Zeabur with a 178-line Python script on OpenClaw",
      description:
        "Migrating a family-schedule alert off hosted n8n into a local OpenClaw cron job — and the latent bug I noticed along the way.",
      tag: "Migration · Cost discipline",
    },
    zh: {
      title:
        "把 $7.88/月的 n8n on Zeabur 換成 178 行的 OpenClaw 本地腳本",
      description:
        "把一個家庭行程提醒從託管的 n8n 搬到本地 OpenClaw cron — 順手修了一個還沒爆的 bug。",
      tag: "遷移 · 成本紀律",
    },
  },
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
