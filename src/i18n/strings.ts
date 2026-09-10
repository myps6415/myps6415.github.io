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
      href?: string;
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
      title: "John Tung — Data Lead · Principal Data Engineer",
      description:
        "Data Lead and Principal Data Engineer in Taipei. Builds enterprise Data/AI platforms on GCP — BigQuery, dbt, Cloud Run, Gemini — and leads the people who run them.",
    },
    hero: {
      eyebrow: "John Tung · 童曉瑜",
      headline1: "Data Lead · Principal Data Engineer.",
      headline2: "",
      body:
        "Ten years building data platforms on GCP, AWS and Azure; two and a half of them leading a Data Team. Today I run the data function at a media group — the platform, the AI on top of it, and the people — and I still ship code. I pick tools to fit the problem, and I judge the work by whether non-engineers actually use it.",
    },
    about: {
      label: "About",
      paragraphs: [
        "Based in Taipei. I lead the data function at a media group and built its platform from zero: cross-platform ingestion (Facebook, Instagram, Threads, YouTube, GA4) into BigQuery, dbt modelling, three production tools that executives, marketing leads and editors open daily, and generative AI running in production with real quality gates. Before that I led a four-person Data Team for two and a half years.",
        "Across previous roles I've shipped on GCP, AWS, and Azure, orchestrating with Airflow and lightweight schedulers, and processed enough data with PySpark, dbt, and BigQuery to know that the right tool is the one that matches the actual requirement — including the team's ability to operate it.",
        "I spend equal time on data modeling and on the boring infrastructure that keeps tokens fresh, jobs idempotent, and bills small.",
        "What I care about most now is making AI trustworthy enough for a newsroom: grounded generation, evaluations that fail the job when quality slips, and agents that work inside explicit rules. It's really a return to the text mining and sentiment analysis I started out in.",
      ],
    },
    work: {
      label: "Selected Work",
      intro: "Things I've shipped that made a measurable dent.",
      cases: [
        {
          metric: "240+ posts",
          metricLabel: "auto-published",
          title: "Content automation system (Distill)",
          body: [
            "A content line on a single Mac: picks topics from frontline sources daily, rewrites them in Traditional Chinese, fact-checks, auto-publishes to several social channels, then sediments them into an owned website. 3 channels, ~40k views/month, zero daily human ops.",
            "Engineered for \"reads human, never wrong\" as a reliability problem — a fact-check gate, a four-layer publish defense, de-AI style rules, and an engagement feedback loop. This site is one of its outputs.",
          ],
          tags: ["LLM Pipeline", "Automation", "Threads API"],
          href: "/services/",
        },
        {
          metric: "Gemini in prod",
          metricLabel: "with quality gates",
          title: "Generative AI that stays inside the lines",
          body: [
            "Gemini runs inside BigQuery (AI.GENERATE) to classify comment sentiment and post topics and to write commentary grounded only in the current figures; Vertex embeddings + KMEANS turn negative comments into named themes. A comment RAG layer is gated by a weekly LLM-as-judge evaluation — when retrieval quality drops, the job fails instead of quietly degrading.",
            "A four-tool newsroom agent is live: no free-form SQL, a mandatory self-check after every draft, hard cost caps, and a weekly replay eval. Shared caching keeps AI cost flat as usage grows.",
          ],
          tags: ["BigQuery AI.GENERATE", "RAG + LLM-as-judge", "Agent guardrails"],
        },
        {
          metric: "3 products",
          metricLabel: "used by non-engineers",
          title: "Dashboards executives and editors actually open",
          body: [
            "A group digital-revenue dashboard for C-level, a social-performance dashboard for marketing leads and editors, and a tool that typesets monthly revenue tables into print-ready newspaper PDFs — all on Streamlit + Cloud Run with Google sign-in.",
            "A three-tier ACL lets managers add and remove users themselves, with an audit trail and usage analytics, so nobody has to file a ticket to get access.",
          ],
          tags: ["Streamlit", "OIDC + ACL", "Cloud Run"],
        },
        {
          metric: "$300 → <$1",
          metricLabel: "monthly cost",
          title: "Inherited pipeline rewrite",
          body: [
            "Took over a Composer + Apps Script revenue pipeline and replaced it with BigQuery External Tables + Scheduled Queries. Same outputs, same freshness, ~300× cheaper to run each month.",
            "The lesson I keep applying: most \"pipelines\" don't need an orchestrator — they need a query that runs on a schedule.",
          ],
          tags: ["BigQuery", "Scheduled Queries", "Cost"],
        },
        {
          metric: "34 jobs",
          metricLabel: "staggered, monitored",
          title: "Cross-platform ingestion that fails loudly",
          body: [
            "Facebook, Instagram, Threads, YouTube and GA4 into BigQuery via 34 Cloud Run Jobs on staggered schedules, modelled in dbt with append-only history — every change preserved, not just the latest state.",
            "dbt source freshness, account-level checks and Cloud Monitoring catch the worst class of failure: a job that succeeds but writes nothing.",
          ],
          tags: ["Cloud Run Jobs", "dbt", "BigQuery"],
        },
        {
          metric: "0 humans",
          metricLabel: "in the auth loop",
          title: "OAuth without tickets",
          body: [
            "Dual-account Threads OAuth across 8 scopes, with a weekly Cloud Run Job that rotates the 60-day token through Secret Manager — nobody gets paged to re-authorise. For the editors, a pure-frontend helper on Cloudflare Pages walks them through granting API access themselves: static hosting, zero backend, near-zero ops.",
          ],
          tags: ["OAuth 2.0", "Secret Manager", "Cloudflare Pages"],
        },
      ],
    },
    writing: {
      label: "Writing",
      intro: "Postmortems and longer-form notes.",
      readMore: "Read all posts →",
      indexTitle: "Writing — John Tung",
      indexDescription:
        "Postmortems, write-ups, and longer-form notes from John Tung — Data Lead · Principal Data Engineer.",
    },
    now: {
      label: "Currently",
      intro: "What's on the workbench.",
      items: [
        {
          title: "Requirements as data",
          body:
            "A PoC that turns requirement interviews into a typed, traceable record store — every requirement points back to what the user actually said — audited by five checker agents on different models, with an A/B run against the previous approach.",
        },
        {
          title: "Data governance that people can act on",
          body:
            "Closing the gaps found in a governance inventory — cost attribution, least-privilege access, access requests to IT — and writing each decision down so the team and its AI agents work from the same rules.",
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
      title: "童曉瑜 — Data Lead · Principal Data Engineer",
      description:
        "Data Lead・Principal Data Engineer，人在台北。在 GCP 上從零建企業級 Data／AI 平台（BigQuery、dbt、Cloud Run、Gemini），也帶運作它的團隊。",
    },
    hero: {
      eyebrow: "童曉瑜 · John Tung",
      headline1: "Data Lead · Principal Data Engineer。",
      headline2: "",
      body:
        "十年在 GCP、AWS、Azure 上建資料平台，其中兩年半帶 Data Team。現在在媒體集團負責整條資料線——平台、平台上的 AI、還有人——也還親自寫 code。工具看需求挑；做得好不好，看的是非工程師有沒有真的在用。",
    },
    about: {
      label: "關於我",
      paragraphs: [
        "人在台北。目前在媒體集團帶資料線，平台是從零建起來的：Facebook／Instagram／Threads／YouTube／GA4 跨平台 ingestion 進 BigQuery、dbt 建模、三個主管與編輯每天打開的上線產品，以及真的上了生產、而且有品質把關的生成式 AI。再往前，帶過 4 人的 Data Team 兩年半。",
        "過去幾份工作，GCP、AWS、Azure 都有正式環境的經驗，工作流程編排用過 Airflow 和輕量的 scheduler，資料處理 PySpark、dbt、BigQuery 都跑過 — 累積下來的心得是：最適合的工具，是「對得上實際需求 + 團隊維護得起來」的那一個。",
        "資料建模和基礎建設這兩塊花的時間差不多 — 後者像是讓 token 不會過期、讓 job 保持 idempotent、讓帳單一直停在很小的數字。",
        "現在最投入的，是讓 AI 可靠到能進編輯台：只依據數據生成、品質一掉就讓任務失敗的評測、在明確規則裡工作的 agent——其實就是回到本業：中文文字探勘與輿情分析。",
      ],
    },
    work: {
      label: "代表作",
      intro: "幾個有成效的案子。",
      cases: [
        {
          metric: "240+ 篇",
          metricLabel: "自動發佈",
          title: "內容自動化系統（Distill）",
          body: [
            "一台 Mac 上跑的內容產線：每天從國外一線來源選題，用繁體中文重寫、事實查核，自動發佈到多個社群頻道，再沉澱成自有網站資產。3 個頻道、月觸及約 4 萬 views，日常零人工操作。",
            "把「像真人寫、而且不出錯」當可靠性問題設計——事實查核閘門、四層發佈防線、去 AI 味規則、成效回饋。這個站本身就是它的產物。",
          ],
          tags: ["LLM Pipeline", "自動化", "Threads API"],
          href: "/zh/services/",
        },
        {
          metric: "Gemini 上生產",
          metricLabel: "有品質把關",
          title: "不會越線的生成式 AI",
          body: [
            "Gemini 直接在 BigQuery 裡跑（AI.GENERATE）：留言情緒與貼文主題分類、只依當期數字寫的 AI 觀點；Vertex 嵌入 + KMEANS 把負評分群、命名主題。留言 RAG 檢索每週跑一次 LLM-as-judge 評測——檢索品質一掉，任務直接失敗，不會默默變差。",
            "編輯台 4 工具 agent 已上線：不寫 SQL、每份草稿強制自檢、成本硬上限、每週回放評測。共用快取讓 AI 成本不隨使用人數膨脹。",
          ],
          tags: ["BigQuery AI.GENERATE", "RAG + LLM-as-judge", "Agent 守門"],
        },
        {
          metric: "3 個產品",
          metricLabel: "非工程師每天用",
          title: "主管與編輯真的會打開的儀表板",
          body: [
            "給 C-level 的集團數位營收儀表板、給行銷主管與編輯的社群成效儀表板、把月營收表排成報紙版面 PDF 的產製工具——都在 Streamlit + Cloud Run 上、Google 登入。",
            "三層 ACL 讓主管自己增刪成員，留稽核軌跡、埋使用分析；要權限不必再開單。",
          ],
          tags: ["Streamlit", "OIDC + ACL", "Cloud Run"],
        },
        {
          metric: "$300 → <$1",
          metricLabel: "月成本",
          title: "接手 pipeline 重寫",
          body: [
            "接手一條原本跑在 Composer + Apps Script 上的營收 pipeline，整套換成 BigQuery External Tables + Scheduled Queries。產出一樣、時效一樣，月支出降到原本的 1/300。",
            "這個案子之後一直在套用的心得：多數「pipeline」其實不需要 orchestrator，需要的只是一個會照排程跑的 query。",
          ],
          tags: ["BigQuery", "Scheduled Queries", "成本"],
        },
        {
          metric: "34 jobs",
          metricLabel: "錯峰排程、有監控",
          title: "會大聲失敗的跨平台 ingestion",
          body: [
            "Facebook、Instagram、Threads、YouTube、GA4 進 BigQuery——34 個 Cloud Run Jobs 錯開時間排程，dbt 建模、append-only 保留每次變動（不只最新狀態）。",
            "dbt source freshness、帳號級守門、Cloud Monitoring 三層一起，抓最糟的那種失敗：job 成功，但什麼都沒寫。",
          ],
          tags: ["Cloud Run Jobs", "dbt", "BigQuery"],
        },
        {
          metric: "0 人",
          metricLabel: "在授權流程裡",
          title: "不用開單的 OAuth",
          body: [
            "Threads 雙帳號 OAuth、8 種權限，每週一支 Cloud Run Job 透過 Secret Manager 自動換 60 天 token——沒有人會因為 token 過期被叫起來。給編輯的那一端，是 Cloudflare Pages 上的純前端自助頁：自己走完授權、零後端、幾乎零維運。",
          ],
          tags: ["OAuth 2.0", "Secret Manager", "Cloudflare Pages"],
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
          title: "需求即資料",
          body:
            "一個 PoC：把需求訪談變成可追溯的型別化記錄庫——每條需求都指得回使用者原話——由五組不同模型的檢查員稽核，並與原做法跑 A/B 對照。",
        },
        {
          title: "做得動的資料治理",
          body:
            "把治理盤點抓到的缺口一項項收掉——成本歸屬、最小權限、對 IT 的存取需求——每個決定都寫下來，讓團隊和 AI agent 照同一套規則做事。",
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
