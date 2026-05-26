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
        "Principal Data Engineer based in Taiwan. Data platforms across GCP, AWS, and Azure. BigQuery, dbt, Airflow, Dagster, PySpark.",
    },
    hero: {
      eyebrow: "John Tung · 童曉瑜",
      headline1: "Principal Data Engineer.",
      headline2: "Data platforms sized to the problem, observable by default.",
      body:
        "I've shipped production systems on GCP, AWS, and Azure — orchestrated with Airflow, Dagster, or just a scheduler when that was the right answer. The best tool depends on the constraint in front of you, not on the trend cycle.",
    },
    about: {
      label: "About",
      paragraphs: [
        "Based in Taiwan. I lead the social analytics data platform at a media group — owning everything from the Cloud Run Jobs that pull from the Meta Graph API to the dbt marts that surface in Looker Studio.",
        "Across previous roles I've shipped on GCP, AWS, and Azure, orchestrating with Airflow, Dagster, and lightweight schedulers, and processed enough data with PySpark, dbt, and BigQuery to know that the right tool is the one that matches the actual requirement — including the team's ability to operate it. Spent 2.5 of those years as a Data Team Lead before switching back to a hands-on Principal IC role.",
        "I spend equal time on data modeling and on the boring infrastructure that keeps tokens fresh, jobs idempotent, and bills small.",
        "Currently going deep on LLM-augmented data pipelines and BigQuery Vector Search for editorial workflows — closer to a return to the text mining and sentiment analysis I came up through than a trend chase.",
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
    now: {
      label: "Currently",
      intro: "What's on the workbench.",
      items: [
        {
          title: "LLM-augmented data pipelines",
          body:
            "Using Gemini for comment sentiment and post topic classification, surfaced as BigQuery marts that downstream dashboards and analysts can query directly.",
        },
        {
          title: "BigQuery Vector Search",
          body:
            "Editorial content pipeline (Elasticsearch → BigQuery embeddings) so editors can do semantic search over historical archives.",
        },
        {
          title: "Silent failure detection",
          body:
            "Automated data-freshness checks plus Cloud Monitoring alerts so a broken upstream API can't go undetected for days.",
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
        "Principal Data Engineer，人在台灣。在 GCP、AWS、Azure 都做過資料平台，工具涵蓋 BigQuery、dbt、Airflow、Dagster、PySpark。",
    },
    hero: {
      eyebrow: "童曉瑜 · John Tung",
      headline1: "Principal Data Engineer。",
      headline2: "資料平台不過度設計，可觀測性是預設。",
      body:
        "GCP、AWS、Azure 都上過 production，orchestration 用過 Airflow、Dagster，需求單純的時候直接用 scheduler。最適合的工具是條件挑出來的，不是看當下哪個話題熱。",
    },
    about: {
      label: "關於我",
      paragraphs: [
        "人在台灣。目前在一家媒體集團負責社群分析資料平台，從 Meta Graph API 的 Cloud Run Jobs，到存入 Looker Studio 的 dbt marts，都由自己負責建置。",
        "過去幾份工作，GCP、AWS、Azure 都有正式環境的經驗，orchestration 用過 Airflow、Dagster 和輕量的 scheduler，資料處理 PySpark、dbt、BigQuery 都跑過 — 累積下來的心得是：最適合的工具，是「對得上實際需求 + 團隊維護得起來」的那一個，不是當下話題最熱的那一個。其中 2.5 年擔任 Data Team Lead，之後選擇回到 Principal IC 的角色繼續動手做事。",
        "資料建模和基礎建設這兩塊花的時間差不多 — 後者像是讓 token 不會過期、讓 job 保持 idempotent、讓帳單一直停在很小的數字。",
        "現在主力在做 LLM-augmented data pipelines，以及 BigQuery Vector Search 在編輯端的應用。這對我而言比較像回到本業（中文文字探勘與輿情分析），而非追逐潮流。",
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
    now: {
      label: "正在做",
      intro: "目前手上在做的事。",
      items: [
        {
          title: "LLM-augmented data pipelines",
          body:
            "用 Gemini 對留言做情緒分析、對貼文做主題分類，產出可供 dashboard 和分析師直接查詢的 BigQuery 資料表。",
        },
        {
          title: "BigQuery Vector Search",
          body:
            "編輯內容的 pipeline（Elasticsearch → BigQuery embeddings），讓編輯可以對歷史文章做語意搜尋。",
        },
        {
          title: "Silent failure 偵測",
          body:
            "自動化的資料新鮮度檢查 + Cloud Monitoring 通知，避免上游 API 壞掉好幾天才被發現。",
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
