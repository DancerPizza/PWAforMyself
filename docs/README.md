# Expo PWA 極簡工具集

個人離線使用的 iPhone PWA 小工具集合，目標是保持功能簡單、資料本地儲存、安裝與預覽流程輕量。

## 線上版本（PWA）

**https://dancerpizza.github.io/PWAforMyself/**

iPhone Safari 開啟 → 分享 → **加入主畫面**。  
有網路時開啟一次後，即可關閉電腦、斷網從主畫面使用（資料在 localStorage，App 殼由 Service Worker 快取）。

## 功能概要

- 主畫面：三個功能入口按鈕。
- 極簡代辦事項：月曆檢視、日期標記、當月代辦列表（由近至遠）、已過期未完成高亮。
- 簡易筆記本：列表檢視、分類篩選（生活／工作／學習）、CRUD。
- 收支紀錄：年曆入口、月份列表、收入／支出 CRUD、支出分類圓餅圖。
- 不做登入、雲端同步、自動提醒或推播通知。

## 文件

- [product/Spec.md](./product/Spec.md)：產品目的、技術棧、工具選用與階段性任務。
- [process/Project_Log.md](./process/Project_Log.md)：實作日誌。
- [process/workflow.md](./process/workflow.md)：個人離線開發流程與 Git 步驟。
- [agent/AGENTS.md](./agent/AGENTS.md)：Cursor Agent 開發準則與進度追蹤。

## 開發快速開始

```bash
npm install
npm run web          # 日常開發預覽（本機）
npm run build:web    # 產出 dist/（含 manifest、Service Worker）
```

## GitHub Pages 部署

push 至 `main` 後，`.github/workflows/deploy-pages.yml` 會自動 build 並部署。

**首次啟用（只需一次）：**

1. 開啟 https://github.com/DancerPizza/PWAforMyself/settings/pages
2. **Build and deployment** → Source 選 **GitHub Actions**
3. 等待 Actions 跑完（約 1–2 分鐘）
4. 以手機開啟上方線上網址 → 加入主畫面

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

目前本機版本基準為 Node.js `v22.23.1`、npm `10.9.8`、Expo SDK `56.0.14`、Expo CLI `56.1.18`。

## 技術棧

Expo、React、React Native Web、TypeScript、PWA、localStorage、IndexedDB。

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
- `docs/agent/AGENTS.md`、`docs/product/Spec.md` — 產品規格文字（非 UI）
