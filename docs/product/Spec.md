# Spec

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
| 手機預覽 | Expo Go / Expo Tunnel / Web Preview | 用 iPhone 即時預覽開發成果 |
| UI 測試 | Browser DevTools | 模擬 iPhone 尺寸、檢查響應式與觸控體驗 |
| 版本控制 | Git / GitHub CLI | 個人離線開發紀錄、GitHub 推送與 repo 管理 |

## 開發環境狀態

- PC：Node.js `v24.18.0`。
- PC：npm `11.16.0`。
- Expo SDK：`56.0.12`。
- Expo CLI：`56.1.16`。
- React / React DOM：`19.2.3`，已依 `npx expo install --check` 對齊 Expo SDK 56。
- React Native：`0.85.3`，已依 `npx expo install --check` 對齊 Expo SDK 56。
- PC：Git 已安裝。
- PC：GitHub CLI 已安裝。
- iPhone：Expo Go 已安裝。
- 需確認：GitHub CLI 是否已登入。
- 注意：npm 目前會顯示 `Unknown env config "devdir"` 警告，屬使用者 npm 設定警告，暫不阻塞專案指令。
- 注意：`npm audit` 顯示 11 個 moderate vulnerabilities，主要來自 Expo CLI / `@expo/ngrok` 相關依賴；`npm audit fix --force` 會降級 Expo 至舊版，暫不執行。
- 注意：若 Expo 建專案或啟動時遇到相容性問題，改用 Node.js LTS 22。

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
- [ ] 用 iPhone Expo Go 即時預覽。

### M2 本地儲存

- [x] 建立共用 storage helper。
- [x] 定義三項功能的資料型別。
- [x] 完成 localStorage 讀寫、更新與刪除。

### M3 極簡代辦事項

- [ ] 建立月曆檢視。
- [ ] 標示有代辦的日期。
- [ ] 點選日期後顯示當日代辦。
- [ ] 支援新增、編輯、完成與刪除。

### M4 簡易筆記本

- [ ] 建立筆記列表。
- [ ] 支援新增、編輯、刪除。
- [ ] 支援標題、描述、日期與分類。

### M5 收支紀錄

- [ ] 建立年曆入口。
- [ ] 建立月份列表。
- [ ] 支援收入與支出紀錄。
- [ ] 依分類統計金額。
- [ ] 建立簡易長條圖。

### M6 PWA 與手機測試

- [ ] 補齊 manifest 設定。
- [ ] 驗證 iPhone Safari 加到主畫面。
- [ ] 測試手機尺寸、觸控操作與本地儲存。
- [ ] 更新 `docs/process/Project_Log.md` 與 `docs/agent/AGENTS.md` 進度。
