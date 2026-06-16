export type Locale = "en" | "zh";

export interface SiteContent {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    headline1: string;
    headline2: string;
    body: string;
  };
  about: { label: string; paragraphs: string[] };
  work: {
    label: string;
    intro: string;
    cases: Array<{
      metric: string;
      metricLabel: string;
      title: string;
      body: string[];
      tags: string[];
    }>;
  };
  writing: {
    label: string;
    intro: string;
    readMore: string;
    indexTitle: string;
    indexDescription: string;
  };
  now: {
    label: string;
    intro: string;
    items: Array<{ title: string; body: string }>;
  };
  connect: {
    label: string;
    intro: string;
    footer: string;
  };
}

export const content: Record<Locale, SiteContent> = {
  en: {
    meta: {
      title: "John Tung — Principal Data Engineer",
      description:
        "Principal Data Engineer based in Taiwan. Data platforms across GCP, AWS, and Azure. BigQuery, dbt, Airflow, PySpark.",
    },
    hero: {
      eyebrow: "John Tung · 童曉瑜",
      headline1: "Principal Data Engineer.",
      headline2: "",
      body:
        "I've run production on GCP, AWS, and Azure, with orchestration on Airflow — or just a scheduler when that fit. Lately most of the work is taking something built too heavy and turning it back into a query that runs on a schedule. I pick tools to fit the problem.",
    },
    about: {
      label: "About",
      paragraphs: [
        "Based in Taiwan. I lead the social analytics data platform at a media group — owning everything from the Cloud Run Jobs that pull from the Meta Graph API to the dbt marts that surface in Looker Studio.",
        "Across previous roles I've shipped on GCP, AWS, and Azure, orchestrating with Airflow and lightweight schedulers, and processed enough data with PySpark, dbt, and BigQuery to know that the right tool is the one that matches the actual requirement — including the team's ability to operate it. Spent 2.5 of those years as a Data Team Lead before switching back to a hands-on Principal IC role.",
        "I spend equal time on data modeling and on the boring infrastructure that keeps tokens fresh, jobs idempotent, and bills small.",
        "The work I'm most invested in now — LLM-augmented pipelines and semantic search over the editorial archive — is really a return to the text mining and sentiment analysis I started out in.",
      ],
    },
    work: {
      label: "Selected Work",
      intro: "Things I've shipped that made a measurable dent.",
      cases: [
        {
          metric: "$300 → <$1",
          metricLabel: "monthly cost",
          title: "Inherited pipeline rewrite",
          body: [
            "Took over a Composer + Apps Script revenue pipeline and replaced it with BigQuery External Tables + Scheduled Queries. Same outputs, same SLAs, ~300× cheaper to run each month.",
            "The lesson I keep applying: most \"pipelines\" don't need an orchestrator — they need a query that runs on a schedule.",
          ],
          tags: ["BigQuery", "Scheduled Queries", "Cost"],
        },
        {
          metric: "15 jobs",
          metricLabel: "orchestrated",
          title: "Multi-platform social ingestion",
          body: [
            "End-to-end pipelines for Facebook, Instagram, Threads, and YouTube into BigQuery via 15 Cloud Run Jobs on staggered schedules, then modeled in dbt with full historical snapshots — every change preserved, not just the latest state.",
            "Powers the Looker Studio dashboards editorial and marketing teams actually open every morning.",
          ],
          tags: ["Cloud Run Jobs", "dbt", "BigQuery"],
        },
        {
          metric: "60-day token",
          metricLabel: "auto-rotated",
          title: "Threads OAuth 2.0, end-to-end",
          body: [
            "Dual-account OAuth across 8 permission scopes, with a weekly Cloud Run Job that rotates the 60-day token through Secret Manager. Replaced the original \"alert the on-call human and hope they re-auth in time\" design with one that's fully unattended.",
          ],
          tags: ["OAuth 2.0", "Secret Manager", "Cloud Run"],
        },
        {
          metric: "Frontend-only",
          metricLabel: "no backend, no ops",
          title: "Self-serve OAuth for non-engineers",
          body: [
            "Pure-frontend authorization helper on Cloudflare Pages. Social-team editors grant API access end-to-end without filing a ticket or pinging me. Static hosting, zero backend, near-zero ops.",
          ],
          tags: ["Cloudflare Pages", "OAuth", "DX"],
        },
      ],
    },
    writing: {
      label: "Writing",
      intro: "Postmortems and longer-form notes.",
      readMore: "Read all posts →",
      indexTitle: "Writing — John Tung",
      indexDescription:
        "Postmortems, write-ups, and longer-form notes from John Tung — Principal Data Engineer.",
    },
    now: {
      label: "Currently",
      intro: "What's on the workbench.",
      items: [
        {
          title: "Editorial semantic search",
          body:
            "Evaluating BigQuery Vector Search vs. self-hosted Elasticsearch so editors can search the historical archive by meaning.",
        },
        {
          title: "Migration wrap-up",
          body:
            "The new architecture is already producing; now decommissioning the last revenue pipeline off the old Composer DAG / Apps Script.",
        },
      ],
    },
    connect: {
      label: "Connect",
      intro: "Get in touch.",
      footer: "Built with Astro.",
    },
  },

  zh: {
    meta: {
      title: "童曉瑜 — Principal Data Engineer",
      description:
        "Principal Data Engineer，人在台灣。在 GCP、AWS、Azure 都做過資料平台，工具涵蓋 BigQuery、dbt、Airflow、PySpark。",
    },
    hero: {
      eyebrow: "童曉瑜 · John Tung",
      headline1: "Principal Data Engineer。",
      headline2: "",
      body:
        "GCP、AWS、Azure 上都跑過 production，工作流程編排用過 Airflow，需求單純時直接用 scheduler。這幾年最常做的，其實是把別人搭得太重的東西改回一個會照排程跑的 query——工具看需求挑。",
    },
    about: {
      label: "關於我",
      paragraphs: [
        "人在台灣。目前在一家媒體集團負責社群分析資料平台，從 Meta Graph API 的 Cloud Run Jobs，到存入 Looker Studio 的 dbt marts，都由自己負責建置。",
        "過去幾份工作，GCP、AWS、Azure 都有正式環境的經驗，工作流程編排用過 Airflow 和輕量的 scheduler，資料處理 PySpark、dbt、BigQuery 都跑過 — 累積下來的心得是：最適合的工具，是「對得上實際需求 + 團隊維護得起來」的那一個。其中 2.5 年擔任 Data Team Lead，之後選擇回到 Principal IC 的角色繼續動手做事。",
        "資料建模和基礎建設這兩塊花的時間差不多 — 後者像是讓 token 不會過期、讓 job 保持 idempotent、讓帳單一直停在很小的數字。",
        "現在最投入的，是 LLM 強化的資料管線，以及讓編輯對歷史文章做語意搜尋——其實就是回到本業：中文文字探勘與輿情分析。",
      ],
    },
    work: {
      label: "代表作",
      intro: "幾個有成效的案子。",
      cases: [
        {
          metric: "$300 → <$1",
          metricLabel: "月成本",
          title: "接手 pipeline 重寫",
          body: [
            "接手一條原本跑在 Composer + Apps Script 上的營收 pipeline，整套換成 BigQuery External Tables + Scheduled Queries。產出一樣、SLA 一樣，月支出降到原本的 1/300。",
            "這個案子之後一直在套用的心得：多數「pipeline」其實不需要 orchestrator，需要的只是一個會照排程跑的 query。",
          ],
          tags: ["BigQuery", "Scheduled Queries", "成本"],
        },
        {
          metric: "15 jobs",
          metricLabel: "排程化",
          title: "多平台社群 ingestion",
          body: [
            "Facebook、Instagram、Threads、YouTube 四個平台的資料端到端存入 BigQuery — 15 個 Cloud Run Jobs 搭配錯開時間的排程觸發，再用 dbt 建模並保留完整的歷史快照（每次變動都留下來，不只最新狀態）。",
            "編輯和行銷每天會打開的 Looker Studio dashboard。",
          ],
          tags: ["Cloud Run Jobs", "dbt", "BigQuery"],
        },
        {
          metric: "60 天 token",
          metricLabel: "自動更新",
          title: "Threads OAuth 2.0 全自動化",
          body: [
            "雙帳號 OAuth，涵蓋 8 種權限範圍，再用每週執行的 Cloud Run Job 透過 Secret Manager 自動更新 60 天 token。原本的設計是「token 快過期就 alert on-call、再請對方手動重新授權」，升級成完全自動、不需要有人介入。",
          ],
          tags: ["OAuth 2.0", "Secret Manager", "Cloud Run"],
        },
        {
          metric: "純前端",
          metricLabel: "零後端、零維運",
          title: "給非工程師的自助 OAuth 工具",
          body: [
            "Cloudflare Pages 上的純前端授權工具。社群團隊的編輯可以自己跑完整個 API 授權流程，不用開 ticket、不用敲工程師。純靜態 hosting、沒有 backend、幾乎不用維護。",
          ],
          tags: ["Cloudflare Pages", "OAuth", "DX"],
        },
      ],
    },
    writing: {
      label: "寫作",
      intro: "Postmortem 跟比較長的工作筆記。",
      readMore: "看全部文章 →",
      indexTitle: "寫作 — 童曉瑜",
      indexDescription:
        "童曉瑜的 postmortem、技術整理、以及比較長的工作筆記。",
    },
    now: {
      label: "正在做",
      intro: "目前手上在做的事。",
      items: [
        {
          title: "編輯台語意搜尋",
          body:
            "評估 BigQuery Vector Search 與 self-host Elasticsearch 兩條路，讓編輯對歷史文章做語意搜尋。",
        },
        {
          title: "遷移收尾",
          body:
            "新架構已出數，正把最後一條營收 pipeline 從舊的 Composer DAG / Apps Script 完全下線。",
        },
      ],
    },
    connect: {
      label: "聯絡",
      intro: "歡迎聊聊。",
      footer: "以 Astro 建置。",
    },
  },
};
