# Spec

> `last_updated`: 2026-07-07

## 專案目的

- 建立一個極簡、可安裝到 iPhone 主畫面的 PWA 個人工具集。
- 以個人離線使用為優先，不做帳號登入、雲端同步、自動提醒或原生通知。
- 降低 App 體積與複雜度，讓三個常用小工具可在同一個入口快速使用。

## MVP 功能範圍

- 主畫面：三個功能入口（僅標題）、匯出／匯入備份列。
- 極簡代辦事項：月曆檢視、事件日期標記、點選日期顯示當日代辦、過期未完成高亮。
- 簡易筆記本：列表檢視，支援標題、描述、日期、分類、分類篩選。
- 收支紀錄：年曆入口、月份列表、收入／支出 CRUD、支出分類圓餅圖。
- 本地儲存：代辦／筆記／收支 → `localStorage`。

### 第二階段（已完成）

- 筆記圖片：IndexedDB blob、表單選圖（最多 3 張）、列表縮圖、查看模式（圖片輪播 + 詳情）。
- UX：刪除確認、共用表單欄位（`FormField`、`FormDateField`）。
- 資料匯出匯入：主畫面 JSON 備份（覆蓋前確認）；**不含**圖片 blob。

## 非 MVP 範圍

- 不做使用者登入。
- 不做雲端同步。
- 不做自動提醒或推播通知。
- 不做原生 iOS 小工具 Widget。
- 不做行事曆提醒功能，但功能頁可使用月曆、年曆作為資料瀏覽 UI。
- 不做複雜狀態管理。
- 不做：拍照、畫筆、備份內嵌圖片 blob（可列為後續優化）。

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
| 手機預覽 | Web Preview + Browser DevTools | 日常開發以瀏覽器模擬 iPhone |
| UI 測試 | Browser DevTools | 模擬 iPhone 尺寸、檢查響應式與觸控體驗 |
| 版本控制 | Git / GitHub CLI | 個人離線開發紀錄、GitHub 推送與 repo 管理 |

## 開發環境狀態

- 版本基準見 [`AGENTS.md`](../../AGENTS.md) §開發環境。
- 暫時性環境警告與 `npm audit` 紀錄見 [`docs/process/Project_Log.md`](../process/Project_Log.md)。

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
- 文件分類於 `docs/product/`、`docs/process/`。
- `AGENTS.md` 保留於專案根目錄，作為唯一跨工具權威。

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
| `imageIds` | string[] | IndexedDB 圖片 blob 參照（最多 3 張） |
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

## 驗收條件

### M6 PWA 與離線

- Service Worker 策略：Cache-First（靜態資源：HTML / JS / CSS / icons）。
- 不做 Background Sync、不做 Push Notification。
- `localStorage` 由瀏覽器獨立管理，不在 Service Worker 快取範圍內。
- 離線驗收：斷網後仍可開啟已安裝的 PWA 並讀寫 `localStorage` 資料。
- 正式 HTTPS 離線驗收已通過（2026-07-07）；讀寫正常。
- 已知問題 **PWA-001**（iOS 獨立 PWA 重開後滑動失效）見 [`AGENTS.md`](../../AGENTS.md) §已知問題；不影響資料正確性。

### 第二階段（批次 C）筆記圖片

- IndexedDB 儲存圖片 blob（`src/storage/noteImages.ts`）；筆記表單支援選擇圖片；列表顯示縮圖。
- 查看模式：上半 `NoteImageCarousel` 左右滑動、下半 `NoteDetailView` 顯示標題／描述／日期／分類。
- 每則筆記最多 3 張圖（`MAX_NOTE_IMAGES`）。
- 不做：拍照、畫筆、雲端同步。
- JSON 備份僅含 `imageIds`；圖片 blob 不隨匯出檔移轉。

### 資料匯出匯入（批次 E）

- 匯出 localStorage JSON 備份；匯入還原（覆蓋前需確認）。
- 主畫面提供「匯出備份」「匯入還原」按鈕（Web PWA）。
