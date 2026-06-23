# 瀏覽器 CMS 設定（Sveltia CMS + Cloudflare Worker）

CMS 在 **`/admin`**。內容就是 `src/content/blog/{en,zh}/` 裡的 MDX。
登入走 GitHub OAuth，透過一支**自架的 Cloudflare Worker**（免費額度——沒有任何第三方
服務碰你的 repo）。總成本 **$0**。

repo 內的部分（`public/admin/index.html`、`public/admin/config.yml`）已經做好。
下面的步驟需要用到你的 GitHub 與 Cloudflare 帳號。

---

## 0. 先在本地試編輯器——不需要任何帳號

`config.yml` 設了 `local_backend: true`，所以你可以在還沒設定任何登入之前，就用真正的
CMS UI 直接操作本地檔案。

Sveltia 的本地模式用瀏覽器的 **File System Access API**（要用 Chrome / Edge 等 Chromium
瀏覽器）：

```bash
npm run dev
```

打開 <http://localhost:4321/admin/index.html>（dev server 不會把 `/admin/` 解析到
`index.html`，所以本地要帶 `index.html`；正式站的 `/admin/` 正常）→ 點
**「Work with Local Repo」** → 選 repo 根目錄 `myps6415.github.io` → 允許讀寫。

**重要的 round-trip 檢查**：存檔後確認 `<StatRow>` / `<DiffBlock>` / `<CodeBlock>`
這些元件區塊有沒有被動到（`git diff` 看一眼）。如果 rich-text 編輯器把它們重排了，就把
`config.yml` 裡 `body` 的 widget 從 `markdown` 改成 `text`（純文字框、對 MDX 無損；prose
照樣好編）。

> 備註：也可以改跑 Decap 的 proxy（`npx decap-server`）走代理模式，但 Sveltia 原生的選
> 資料夾方式更直接、不需要 proxy。

---

## 1. 建一個 GitHub OAuth App

GitHub → Settings → Developer settings → **OAuth Apps** → **New OAuth App**

- **Application name：** `Sveltia CMS – myps6415.github.io`
- **Homepage URL：** `https://myps6415.github.io`
- **Authorization callback URL：** 這裡有個先有雞還是先有蛋的坑——真正的 callback 是
  `https://<worker-url>/callback`，但 Worker 要到第 2 步才部署、你現在還沒有那個網址；而
  GitHub **要求填語法正確的真網址**（填 `<worker-url>` 會報 *Callback url must be a valid URL*）。
  所以**先暫填一個合法網址**把 App 建起來：
  ```
  https://myps6415.github.io/callback
  ```

Register → 複製 **Client ID** → **Generate a new client secret** → 複製 secret。

> ⚠️ 這個 callback 只是暫時佔位。**第 2 步部署完 Worker、拿到真網址後，務必回到這個
> OAuth App 把 callback 改成 `https://<worker-url>/callback`**（結尾要有 `/callback`，且要跟
> Worker 實際用的完全一致），否則登入會失敗。

## 2. 部署 OAuth Worker（Cloudflare，免費）

官方 Worker：<https://github.com/sveltia/sveltia-cms-auth>

最快是用該 repo 的 **Deploy to Cloudflare** 按鈕；或 clone 下來 `npx wrangler deploy`。
然後在 Worker 上設這幾個變數（dashboard → 該 Worker → Settings → Variables，或
`wrangler secret put <NAME>`）：

| 變數 | 值 |
|------|-----|
| `GITHUB_CLIENT_ID` | 第 1 步拿到的 |
| `GITHUB_CLIENT_SECRET` | 第 1 步拿到的 |
| `ALLOWED_DOMAINS` | `myps6415.github.io` |

記下 Worker 網址，例如 `https://sveltia-cms-auth.<你的子網域>.workers.dev`。
回到 GitHub OAuth App，把 **callback URL** 設成 `<worker-url>/callback`。

## 3. 接起來

1. 把 `public/admin/config.yml` 的 `base_url:` 改成你的 Worker 網址。
2. commit + push（GitHub Pages 自動部署）。
3. 打開 <https://myps6415.github.io/admin/> → **用 GitHub 登入** → 開始編輯。

> 把 Worker 網址貼給我，我可以幫你填進 `base_url` 並合併上線。

---

## 行為說明

- **新文章：** New entry → EN、ZH 並排填。`postSlug` 會變成**兩個語言資料夾**裡的檔名；
  按 **Publish** 就 commit 進 `main` → Pages 重建。
- **語言 = 資料夾。** CMS 寫到 `src/content/blog/en/<postSlug>.mdx` 和
  `.../zh/<postSlug>.mdx`；Astro 從資料夾推導語言。
- **雙語流程：** 寫一種語言、讓 AI 草另一種、在 CMS 裡審。
- **元件區塊**（`StatRow`、`DiffBlock`、`CodeBlock`…）在編輯器裡是原始 MDX——編輯它周圍的
  prose、別動那些標籤。
- **成本 / 安全：** Workers 免費額度是 10 萬次請求/天，登入只用幾次，所以 $0/月。只有你自己
  的 GitHub OAuth App 和 Worker 能寫入 repo。
