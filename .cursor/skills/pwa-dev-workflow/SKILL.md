---
name: pwa-dev-workflow
description: Guides development for this personal offline Expo PWA tool project. Use when implementing features, updating docs, planning MVP work, choosing storage, or preparing Git steps for the PWA app.
disable-model-invocation: true
last_updated: 2026-07-07
---

# PWA Dev Workflow

## 使用時機

- 開發極簡代辦事項、簡易筆記本或收支紀錄。
- 更新 `docs/product/Spec.md`、`docs/process/Project_Log.md`、`AGENTS.md` 或 `docs/process/workflow.md`。
- 需要在 MVP 與後續功能之間做取捨。
- 需要規劃個人離線開發 Git 步驟。

## 工作流程

1. 依 `AGENTS.md` §開工讀檔規則 讀取必要文件；**新 Context 先讀 §下次開工摘要**。
2. 確認需求是否屬於既有範圍或後續可選方向（見 AGENTS §後續可選方向）。
3. 若有多種非破壞性方案，依 `AGENTS.md` §操作確認規則 使用選項彈窗。
4. 破壞性指令依 `AGENTS.md` §操作確認規則 列出影響清單並等待確認。
5. 優先使用 Expo、React、React Native Web、TypeScript 與瀏覽器本地能力。
6. JSON 資料用 `localStorage`；筆記圖片 blob 用 IndexedDB（`noteImages.ts`）。
7. 避免加入登入、雲端同步、自動提醒、推播通知、SQLite 或原生通知。
8. 完成實作後，同步更新 `docs/process/Project_Log.md`。
9. 若階段任務或產品方向改變，同步更新 `AGENTS.md` §專案進度 與 `docs/product/Spec.md`。

## 功能範圍判斷（2026-07-07）

- **已完成**：主畫面、三功能 CRUD、localStorage、PWA 部署、筆記圖片（IndexedDB）、查看模式、刪除確認、共用表單、JSON 匯出匯入。
- **已知未解**：PWA-001（iOS 獨立 PWA 重開滑動失效）— 見 AGENTS §已知問題。
- **後續可選**：PWA-001 修復、備份納入圖片 blob、使用者指定新功能。
- **不做**：登入、雲端同步、推播提醒、原生 iOS Widget、拍照、畫筆。

## 儲存約定

| 資料 | 位置 | 備註 |
|------|------|------|
| 代辦／筆記 JSON／收支 | `localStorage` | `backup.ts` 匯出匯入 |
| 筆記圖片 blob | IndexedDB | `imageIds` 在 `NoteItem`；匯出不含 blob |

## 部署

- 正式網址：https://dancerpizza.github.io/PWAforMyself/
- `npm run build:web` → push `main` → `.github/workflows/deploy-pages.yml`
- `experiments.baseUrl`：`/PWAforMyself`

## 文件同步檢查

- `docs/product/Spec.md`：產品目的、技術棧、資料模型、驗收條件。
- `docs/process/Project_Log.md`：以 `[yyyy-mm-dd]` 區塊記錄實作日誌，同類進度以 `[標籤]` 合併。
- `AGENTS.md`：操作規則、下次開工摘要、程式碼地圖、進度與已知問題。
- `docs/README.md`：接手導覽、模組索引、批次狀態。
- `docs/process/workflow.md`：條列式個人離線開發流程與 Git 步驟。

## Git 建議

- 開工先檢查 `git status`。
- 每個小功能使用清楚的分支名稱（可選；個人專案亦可直接 `main`）。
- 提交前確認沒有密鑰、無關檔案或舊原生通知方向內容。
- Commit message 使用簡潔英文或繁中，例如 `feat: add note image picker`。
