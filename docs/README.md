# Expo PWA 極簡工具集

個人離線使用的 iPhone PWA 小工具集合，目標是保持功能簡單、資料本地儲存、安裝與預覽流程輕量。

## 線上版本（PWA）

**https://dancerpizza.github.io/PWAforMyself/**（待**批次 B** 部署上線，目前尚未啟用）

> **下次開工前待辦（批次 B）**：repo 改 Public → Settings → Pages → GitHub Actions → 等 Actions 跑完 → 手機加入主畫面。

iPhone Safari 開啟 → 分享 → **加入主畫面**。  
有網路時開啟一次後，即可關閉電腦、斷網從主畫面使用（資料在 localStorage，App 殼由 Service Worker 快取）。

## 後續批次（MVP 後）

| 批次 | 內容 | 狀態 |
|------|------|------|
| A | M6 HTTPS 離線驗收 | 待批次 B |
| B | GitHub Pages 部署 | **下次優先** |
| C | 筆記圖片 / IndexedDB | 未開始 |
| D | UX 拋光 | 未開始 |
| E | 資料匯出匯入 | 未開始 |

詳見 [AGENTS.md](../AGENTS.md) §未完成進度（依批次）。

## 功能概要

- 主畫面：三個功能入口按鈕。
- 極簡代辦事項：月曆檢視、日期標記、當月代辦列表（由近至遠）、已過期未完成高亮。
- 簡易筆記本：列表檢視、分類篩選（生活／工作／學習）、CRUD。
- 收支紀錄：年曆入口、月份列表、收入／支出 CRUD、支出分類圓餅圖。
- 不做登入、雲端同步、自動提醒或推播通知。

## 文件

- [AGENTS.md](../AGENTS.md)：操作規則、Agent 準則與進度追蹤。
- [product/Spec.md](./product/Spec.md)：產品目的、技術棧、資料模型與驗收條件。
- [process/Project_Log.md](./process/Project_Log.md)：實作日誌。
- [process/workflow.md](./process/workflow.md)：個人離線開發流程與 Git 步驟。

## 開發快速開始

```bash
npm install
npm run web          # 日常開發預覽（本機）
npm run build:web    # 產出 dist/（含 manifest、Service Worker）
```

## GitHub Pages 部署（批次 B）

push 至 `main` 後，`.github/workflows/deploy-pages.yml` 會自動 build 並部署。

**首次啟用（只需一次，下次開工前完成）：**

1. **Settings → General** → 將 repo 改為 **Public**（目前 Private 無法啟用 Pages）
2. 開啟 https://github.com/DancerPizza/PWAforMyself/settings/pages
3. **Build and deployment** → Source 選 **GitHub Actions**
4. push `main`（若已有 workflow 可略過）並等待 Actions 跑完（約 1–2 分鐘）
5. 以手機開啟 HTTPS 網址 → 加入主畫面 → 斷網驗收

之後每次 push `main` 會自動更新網站，**不需**再執行 `npx serve dist`。

### 本機預覽正式版（可選）

```bash
npm run build:web
npx serve dist
```

注意：區網 `http://` 可能無法註冊 Service Worker；離線測試請用 GitHub Pages HTTPS。

## 環境檢查

```bash
node --version
npm --version
npx expo --version
npx expo install --check
npm run typecheck
```

版本基準見 [AGENTS.md](../AGENTS.md) §開發環境。

## 技術棧

詳見 [product/Spec.md](./product/Spec.md) §技術棧。

## UI 顏色與字樣

- `src/theme.ts` — `background`、`text`、`green`、`pink`、`cyan`、`yellow`、`purple`、`monoFont`、`textFont`
- `src/screens/HomeScreen.tsx` — 主畫面字樣
- `src/data/tools.ts` — 功能卡片字樣
- `src/screens/TodoScreen.tsx` — 代辦字樣；`overdueStyle`、`daySelected`、`dayToday`
- `src/screens/NoteScreen.tsx` — 筆記字樣；`categoryChipSelected`、`noteCategory`
- `src/data/noteCategories.ts` — 分類、`noteFilterOptions`
- `src/screens/ExpenseScreen.tsx` — 收支字樣；`incomeText`、`expenseText`、`cardHint`
- `src/data/expenseCategories.ts` — 收支分類選項
- `src/components/ExpensePieChart.tsx` — `segmentColors`
- `AGENTS.md`、`docs/product/Spec.md` — 產品規格文字（非 UI）
