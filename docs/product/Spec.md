# Spec

> `last_updated`: 2026-07-06

## 專案目的

- 建立一個極簡、可安裝到 iPhone 主畫面的 PWA 個人工具集。
- 以個人離線使用為優先，不做帳號登入、雲端同步、自動提醒或原生通知。
- 降低 App 體積與複雜度，讓三個常用小工具可在同一個入口快速使用。

## MVP 功能範圍

- 主畫面：提供三個功能入口按鈕。
- 極簡代辦事項：月曆檢視、事件日期標記、點選日期顯示當日代辦。
- 簡易筆記本：列表檢視，支援標題、描述、日期、分類。
- 收支紀錄：年曆入口、月份列表、分類金額統計。
- 本地儲存：優先使用 `localStorage`；資料量或圖片需求增加時改用 IndexedDB。

## 非 MVP 範圍

- 不做使用者登入。
- 不做雲端同步。
- 不做自動提醒或推播通知。
- 不做原生 iOS 小工具 Widget。
- 不做行事曆提醒功能，但功能頁可使用月曆、年曆作為資料瀏覽 UI。
- 不做複雜狀態管理。
- 圖片上傳、拍攝圖片與簡易畫筆先列為第二階段功能。

## 技術棧

| 類別 | 選用 | 目的 |
| ------ | ------ | ------ |
| App 框架 | Expo | 快速建立跨平台 React 專案，支援 Web 輸出 |
| UI 技術 | React / React Native Web | 以 React 寫法建立可在瀏覽器與手機使用的介面 |
| 語言 | TypeScript | 提升資料結構與功能模組的可維護性 |
| PWA | Web App Manifest + Service Worker | 支援安裝到手機主畫面與基本離線能力 |
| 本地儲存 | localStorage | MVP 階段儲存簡單 JSON 資料 |
| 進階本地儲存 | IndexedDB | 第二階段處理圖片、畫布或較大資料 |
| 開發工具 | Cursor | 編輯、重構、文件維護與 Agent 輔助開發 |
| 手機預覽 | Web Preview + Browser DevTools | 日常開發以瀏覽器模擬 iPhone；實機 PWA 測試留待 M6 |
| UI 測試 | Browser DevTools | 模擬 iPhone 尺寸、檢查響應式與觸控體驗 |
| 版本控制 | Git / GitHub CLI | 個人離線開發紀錄、GitHub 推送與 repo 管理 |

## 開發環境狀態

- 開發機：桌機（2026-07-05 自筆電遷移）。
- PC：Node.js `v22.23.1`。
- PC：npm `10.9.8`。
- Expo SDK：`56.0.14`。
- Expo CLI：`56.1.18`。
- React / React DOM：`19.2.3`，已依 `npx expo install --check` 對齊 Expo SDK 56。
- React Native：`0.85.3`，已依 `npx expo install --check` 對齊 Expo SDK 56。
- PC：Git `2.51.0` 已安裝。
- PC：GitHub CLI 已安裝。
- 日常預覽：`npm run web` + 瀏覽器開發工具；Expo Go 因 App Store 無最新版，不再使用。
- 暫時性環境警告與 `npm audit` 紀錄見 `docs/process/Project_Log.md`。
- 若 Expo 建專案或啟動時遇到相容性問題，改用 Node.js LTS 22。

## 目標裝置資訊

- iPhone 17。
- iOS ver: 26.5。
- 主要瀏覽器為 Safari。

## 工具選用原則

- 優先使用 Expo 與 React 既有能力，避免過早加入大型套件。
- 優先修改現有檔案，不為了抽象化而新增冗餘檔案。
- 新增套件前先檢查是否已有內建功能或現有依賴可完成需求。
- 只在資料量、圖片或離線能力明確需要時才導入 IndexedDB 或額外工具。

## 專案結構原則

- 允許 Agent 在專案根目錄內建立必要資料夾與整理專案結構。
- 尚未開始開發前，不為了形式建立過多空資料夾。
- 建立 Expo 專案後，優先使用 `src/` 放置功能模組、共用元件、資料型別與本地儲存工具。
- 文件分類於 `docs/product/`、`docs/process/`、`docs/agent/`。
- `.cursorrules.md` 保留於專案根目錄，方便每次開工優先讀取。

## 資料模型草案

### TodoItem

| 欄位 | 型別 | 說明 |
| ------ | ------ | ------ |
| `id` | string | 唯一識別碼 |
| `title` | string | 代辦標題 |
| `date` | string | 日期，格式 `YYYY-MM-DD` |
| `done` | boolean | 是否完成 |
| `createdAt` | string | 建立時間 |
| `updatedAt` | string | 更新時間 |

### NoteItem

| 欄位 | 型別 | 說明 |
| ------ | ------ | ------ |
| `id` | string | 唯一識別碼 |
| `title` | string | 筆記標題 |
| `description` | string | 筆記內容 |
| `date` | string | 筆記日期 |
| `category` | string | 分類 |
| `imageIds` | string[] | 第二階段圖片參照 |
| `createdAt` | string | 建立時間 |
| `updatedAt` | string | 更新時間 |

### ExpenseItem

| 欄位 | 型別 | 說明 |
| ------ | ------ | ------ |
| `id` | string | 唯一識別碼 |
| `type` | `"income" \| "expense"` | 收入或支出 |
| `amount` | number | 金額 |
| `category` | string | 分類 |
| `date` | string | 日期，格式 `YYYY-MM-DD` |
| `note` | string | 備註 |
| `createdAt` | string | 建立時間 |
| `updatedAt` | string | 更新時間 |

## 階段性任務

### M0 文件與規則整理

- [x] 建立 `docs/process/Project_Log.md`。
- [x] 建立 `docs/product/Spec.md`。
- [x] 建立 `.cursorrules.md`。
- [x] 更新 `docs/agent/AGENTS.md`。
- [x] 更新 `docs/README.md`。
- [x] 建立 `docs/process/workflow.md`。
- [x] 建立專案開發流程 skill。
- [x] 移除已刪除功能規格文件的索引。
- [x] 分類 Markdown 文件。

### M1 專案骨架

- [x] 建立 Expo TypeScript 專案。
- [x] 確認 Web / PWA 輸出設定。
- [x] 建立主畫面與三個功能入口。
- [ ] 用 iPhone Expo Go 即時預覽（已棄用：改 Web 預覽；實機 PWA 測試留待 M6）。

### M2 本地儲存

- [x] 建立共用 storage helper。
- [x] 定義三項功能的資料型別。
- [x] 完成 localStorage 讀寫、更新與刪除。

### M3 極簡代辦事項

- [x] 建立月曆檢視。
- [x] 標示有代辦的日期。
- [x] 點選日期後顯示當月代辦列表（由近至遠）。
- [x] 支援新增、編輯、完成與刪除。
- [x] 已過期未完成項目高亮。

### M4 簡易筆記本

- [x] 建立筆記列表。
- [x] 支援新增、編輯、刪除。
- [x] 支援標題、描述、日期與分類。
- [x] 分類篩選（生活／工作／學習）。

### M5 收支紀錄

- [x] 建立年曆入口。
- [x] 建立月份列表。
- [x] 支援收入與支出紀錄。
- [x] 依分類統計金額。
- [x] 建立簡易圓餅圖。

### M6 PWA 與手機測試

- Service Worker 策略：Cache-First（靜態資源：HTML / JS / CSS / icons）。
- 不做 Background Sync、不做 Push Notification。
- `localStorage` 由瀏覽器獨立管理，不在 Service Worker 快取範圍內。
- 離線驗收：斷網後仍可開啟已安裝的 PWA 並讀寫 `localStorage` 資料。

- [x] 補齊 manifest 設定。
- [x] 實作並註冊 Service Worker。
- [x] 驗證 iPhone Safari 加到主畫面（區網 HTTP 功能驗證通過）。
- [x] 測試手機尺寸、觸控操作、表單驗證、首頁版面。
- [x] 更新 `docs/process/Project_Log.md` 與 `docs/agent/AGENTS.md` 進度。

## 未完成進度（依批次）

> MVP 功能（M0–M6 程式）已完成。

### 批次 A — M6 收尾

- [ ] 正式 HTTPS 離線驗收（依批次 B 上線後執行）。

### 批次 B — GitHub Pages 部署（下次開工前，優先）

- 網址（上線後）：`https://dancerpizza.github.io/PWAforMyself/`
- **目前狀態**：repo Private，免費版無法啟用 Pages；workflow 已就緒。

- [x] GitHub Actions 自動部署 workflow。
- [x] `baseUrl` 與 PWA 相對路徑設定。
- [x] `dist/.nojekyll`。
- [ ] repo 改為 **Public**。
- [ ] Settings → Pages → **GitHub Actions** 來源。
- [ ] 確認 Actions 部署成功。
- [ ] iPhone HTTPS 加入主畫面 + 斷網驗收。

### 批次 C — 筆記圖片（第二階段）

- [ ] IndexedDB helper（圖片 blob）。
- [ ] 筆記選擇圖片上傳、列表縮圖；`imageIds` 接上。
- 不做：拍照、畫筆。

### 批次 D — UX 拋光

- [ ] 刪除前確認對話框。
- [ ] 日期欄位提示強化（可選：日期選擇器）。
- [ ] 共用表單欄位元件（可選）。

### 批次 E — 資料匯出匯入

- [ ] 匯出 localStorage JSON。
- [ ] 匯入還原（覆蓋前確認）。
