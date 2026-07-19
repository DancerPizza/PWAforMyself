# Expo PWA 極簡工具集

個人離線使用的 iPhone PWA 小工具集合。**專案已結案**（M0–M6、批次 A–E、PWA-SCROLL、PWA-LAYOUT）；正式網址：https://dancerpizza.github.io/PWAforMyself/

## 接手快速導覽

1. 先讀 [AGENTS.md](../AGENTS.md) §下次開工摘要 與 §已知問題
2. 再依 AGENTS §開工讀檔規則 補讀 Spec、workflow、Project_Log
3. `npm run web` 日常開發；push `main` 自動部署 GitHub Pages

進度摘要見 [AGENTS.md](../AGENTS.md) §專案進度（摘要）。

## 功能概要

- 主畫面：三張功能卡（僅標題）、匯出／匯入備份列；flex 比例 75:10:45
- 極簡代辦事項：月曆、日期標記、當月代辦列表（由近至遠）、過期未完成高亮
- 簡易筆記本：列表、分類篩選、CRUD、圖片（最多 3 張）、查看模式（圖片輪播 + 詳情）
- 收支紀錄：年曆、月份列表、收入／支出 CRUD、支出分類圓餅圖
- 不做：登入、雲端同步、自動提醒、推播通知

## 已知問題

目前無開放項目。PWA-001／PWA-002／PWA-LAYOUT 結案紀錄見 [AGENTS.md](../AGENTS.md) §已知問題 與 [Project_Log](./process/Project_Log.md)。

## 文件

- [AGENTS.md](../AGENTS.md)：操作規則、程式碼地圖、下次開工摘要、進度追蹤
- [product/Spec.md](./product/Spec.md)：產品目的、技術棧、資料模型與驗收條件
- [process/Project_Log.md](./process/Project_Log.md)：實作日誌
- [process/workflow.md](./process/workflow.md)：個人離線開發流程與 Git 步驟

## 開發快速開始

```bash
npm install
npm run web          # 日常開發預覽（本機）
npm run build:web    # 產出 dist/（含 manifest、Service Worker）
npm run typecheck
```

## GitHub Pages 部署

- 正式網址：https://dancerpizza.github.io/PWAforMyself/
- `experiments.baseUrl`：`/PWAforMyself`
- push `main` 後 `.github/workflows/deploy-pages.yml` 自動 build 並部署
- 區網 `http://` 可能無法註冊 Service Worker；離線與 PWA 安裝請用 HTTPS 正式網址

### 本機預覽正式版（可選）

```bash
npm run build:web
npx serve dist
```

## 環境檢查

```bash
node --version
npm --version
npx expo --version
npx expo install --check
npm run typecheck
npm test
```

版本基準見 [AGENTS.md](../AGENTS.md) §開發環境。

## 技術棧

詳見 [product/Spec.md](./product/Spec.md) §技術棧。

## 模組與 UI 索引

| 路徑 | 用途 |
|------|------|
| `App.tsx` | 路由、`storageVersion` 匯入刷新 |
| `src/theme.ts` | 色彩與字型 |
| `src/screens/HomeScreen.tsx` | 主畫面版面與功能卡 |
| `src/data/tools.ts` | 功能卡標題 |
| `src/components/BackupActions.web.tsx` | 匯出／匯入 JSON |
| `src/screens/TodoScreen.tsx` | 代辦月曆與列表 |
| `src/screens/NoteScreen.tsx` | 筆記 CRUD、圖片、查看模式 |
| `src/components/notes/` | 圖片選擇、縮圖、輪播、詳情檢視 |
| `src/storage/noteImages.ts` | IndexedDB 圖片 blob |
| `src/storage/backup.ts` | JSON 備份邏輯 |
| `src/screens/ExpenseScreen.tsx` | 收支與圓餅圖 |
| `src/data/noteCategories.ts` | 筆記分類 |
| `src/data/expenseCategories.ts` | 收支分類 |
| `src/components/form/` | `FormField`、`FormDateField` |
| `src/components/ExpensePieChart.tsx` | 圓餅圖 |
| `public/manifest.json`、`public/sw.js` | PWA 安裝與離線 |
