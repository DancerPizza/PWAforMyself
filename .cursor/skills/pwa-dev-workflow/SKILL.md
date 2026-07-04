---
name: pwa-dev-workflow
description: Guides development for this personal offline Expo PWA tool project. Use when implementing features, updating docs, planning MVP work, choosing storage, or preparing Git steps for the PWA app.
disable-model-invocation: true
---

# PWA Dev Workflow

## 使用時機

- 開發極簡代辦事項、簡易筆記本或收支紀錄。
- 更新 `docs/product/Spec.md`、`docs/process/Project_Log.md`、`docs/agent/AGENTS.md`、`.cursorrules.md` 或 `docs/process/workflow.md`。
- 需要在 MVP 與第二階段功能之間做取捨。
- 需要規劃個人離線開發 Git 步驟。

## 工作流程

1. 先讀取 `.cursorrules.md`、`docs/product/Spec.md`、`docs/process/workflow.md`。
2. 接著讀取 `docs/agent/AGENTS.md` 與 `docs/process/Project_Log.md`。
3. 確認需求是否屬於 MVP。
4. 若有多種非破壞性方案，使用選項彈窗讓使用者決定。
5. 破壞性指令需先列出完整影響清單並等待確認。
6. 優先使用 Expo、React、React Native Web、TypeScript 與瀏覽器本地能力。
7. MVP 儲存優先使用 `localStorage`，圖片、畫布或大量資料再評估 IndexedDB。
8. 避免加入登入、雲端同步、自動提醒、推播通知、SQLite 或原生通知。
9. 完成實作後，同步更新 `docs/process/Project_Log.md`。
10. 若階段任務或產品方向改變，同步更新 `docs/product/Spec.md` 與 `docs/agent/AGENTS.md`。

## 裝置資訊

- 建議記錄 iPhone 型號、iOS 版本與主要瀏覽器。
- 裝置資訊只需提供一次，或在裝置與系統版本變更時更新。
- 用於判斷 PWA 安裝、Safari 相容性、本地儲存、圖片、畫布與觸控行為。

## MVP 判斷

- 必要：主畫面、三功能入口、基本 CRUD、本地儲存、手機版 UI。
- 延後：圖片、拍照、畫筆、複雜圖表、資料匯入匯出、IndexedDB。
- 不做：登入、雲端同步、推播提醒、原生 iOS Widget。

## 文件同步檢查

- `docs/product/Spec.md`：產品目的、技術棧、工具選用、階段性任務。
- `docs/process/Project_Log.md`：以 `[yyyy-mm-dd]` 區塊記錄實作日誌，同類進度以 `[標籤]` 合併。
- `docs/agent/AGENTS.md`：Agent 準則與目前進度。
- `docs/process/workflow.md`：個人離線開發流程與 Git 步驟。
- `.cursorrules.md`：固定規則與使用者偏好。

## Git 建議

- 開工先檢查 `git status`。
- 每個小功能使用清楚的分支名稱。
- 提交前確認沒有密鑰、無關檔案或舊原生通知方向內容。
- Commit message 使用簡潔英文，例如 `docs: add PWA workflow`.
