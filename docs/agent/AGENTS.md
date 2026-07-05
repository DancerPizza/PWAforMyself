# Cursor Agent 指南 - PWA 極簡工具集

> `last_updated`: 2026-07-06

## 角色定位

- 你是一位熟悉 Expo、React、React Native Web、TypeScript 與 PWA 的資深前端開發協作者。
- 你的目標是協助建立個人離線使用的極簡 PWA 工具集。
- 專案以 MVP、簡潔資料結構、手機瀏覽器體驗與本地儲存為優先。

## 核心產品方向

- 主畫面提供三個功能入口：極簡代辦事項、簡易筆記本、收支紀錄。
- App 應可透過 iPhone Safari 加到主畫面。
- 資料存於手機本地端，初期不做帳號、雲端同步、自動提醒或推播通知。
- 目前方向為 PWA，不做行事曆提醒或原生通知功能，但功能頁可使用月曆、年曆作為資料瀏覽 UI。

## 操作確認規則

- 破壞性指令、選項彈窗觸發條件：依 `.cursorrules.md` §操作確認規則 執行，不在此重複定義。
- 文件衝突優先序：依 `.cursorrules.md` §開工讀檔規則 › 文件衝突優先序 執行。

## 技術選用

| 類別 | 選用 | 目的 |
| ------ | ------ | ------ |
| App 框架 | Expo | 快速建立跨平台專案與 Web 輸出 |
| UI 技術 | React / React Native Web | 建立手機優先的跨平台介面 |
| 語言 | TypeScript | 維持資料模型與模組邊界清楚 |
| PWA | Manifest + Service Worker | 支援安裝與基本離線能力 |
| MVP 儲存 | localStorage | 儲存簡單 JSON 資料 |
| 進階儲存 | IndexedDB | 第二階段處理圖片、畫布或大量資料 |
| 手機預覽 | Web Preview + Browser DevTools | 日常開發以瀏覽器模擬 iPhone；實機 PWA 測試留待 M6 |

## 開發環境

- 開發機：桌機（2026-07-05 自筆電遷移）。
- Node.js `v22.23.1`、npm `10.9.8`。
- Expo SDK `56.0.14`、Expo CLI `56.1.18`。
- React `19.2.3`、React DOM `19.2.3`、React Native `0.85.3`，已通過 `npx expo install --check`。
- PC 已安裝 Git `2.51.0` 與 GitHub CLI。
- 日常預覽：`npm run web` + 瀏覽器開發工具；Expo Go 因 App Store 無最新版，不再使用。
- 暫時性環境警告與 audit 紀錄見 `docs/process/Project_Log.md`。
- 若 Expo 與 Node.js 24 發生相容性問題，改用 Node.js LTS 22。

## 開發核心原則

- 先完成 MVP，再提出優化方向。
- 優先修改現有檔案，不新增冗餘抽象。
- 優先使用 Expo、React 與瀏覽器既有能力。
- 新增套件前先確認是否已有內建功能或現有依賴可完成需求。
- 避免混入原生通知、SQLite、帳號系統、雲端同步與大型狀態管理。
- 程式碼與變數命名使用英文，註解使用繁體中文。

## 開工與 Context 流程

- 依 `.cursorrules.md` §開工讀檔規則 執行；不在此重複定義讀檔順序。

## 裝置資訊

- iPhone 17。
- iOS ver: 26.5。
- 主要瀏覽器為 Safari。
- 裝置資訊用於判斷 PWA 安裝、Safari 相容性、本地儲存、圖片、畫布與觸控行為。

## 專案結構整理

- 允許 Agent 在專案根目錄內建立必要資料夾與整理專案結構。
- 尚未開始開發前，不為了形式建立過多空資料夾。
- 文件分類於 `docs/product/`、`docs/process/`、`docs/agent/`。
- `.cursorrules.md` 保留於專案根目錄。
- 建立 Expo 專案後，優先以 `src/` 組織功能模組、共用元件、資料型別與本地儲存工具。

## 功能邊界

### 極簡代辦事項

- 月曆檢視。
- 有代辦的日期需標色或標記。
- 點選日期後顯示當日代辦。
- 支援新增、編輯、完成與刪除。

### 簡易筆記本

- 列表檢視。
- 支援標題、描述、日期、分類。
- 圖片上傳、拍攝圖片與簡易畫筆列為第二階段。

### 收支紀錄

- 年曆入口。
- 月份列表。
- 收入與支出紀錄。
- 分類金額圓餅圖。

## 文件維護

- `docs/product/Spec.md` 記錄產品目的、技術棧、工具選用與階段性任務。
- `docs/process/Project_Log.md` 以 `[yyyy-mm-dd]` 區塊記錄實作日誌，同類進度以 `[標籤]` 合併（如 `[畫面]`、`[功能]`、`[文件]`、`[環境]`）。
- `docs/process/workflow.md` 記錄個人離線開發流程與 Git 步驟。
- `.cursorrules.md` 記錄專案固定規則與使用者偏好。
- 每完成里程碑或改變產品方向，需同步更新上述文件。

## 專案進度

### M0 文件與規則整理

- [x] 建立 `docs/process/Project_Log.md`
- [x] 建立 `docs/product/Spec.md`
- [x] 建立 `.cursorrules.md`
- [x] 更新 `docs/agent/AGENTS.md`
- [x] 更新 `docs/README.md`
- [x] 建立 `docs/process/workflow.md`
- [x] 建立專案開發流程 skill
- [x] 移除已刪除功能規格文件的索引
- [x] 分類 Markdown 文件

### M1 專案骨架

- [x] 建立 Expo TypeScript 專案
- [x] 確認 Web / PWA 輸出設定
- [x] 建立主畫面與三個功能入口
- [ ] 用 iPhone Expo Go 即時預覽（已棄用：App Store 無最新版 Expo Go，改 Web 預覽；實機測試留待 M6）

### M2 本地儲存

- [x] 建立共用 storage helper
- [x] 定義三項功能資料型別
- [x] 完成 localStorage 讀寫、更新與刪除

### M3 極簡代辦事項

- [x] 建立月曆檢視
- [x] 標示有代辦的日期
- [x] 點選日期後顯示當月代辦列表（由近至遠）
- [x] 支援新增、編輯、完成與刪除
- [x] 已過期未完成項目高亮

### M4 簡易筆記本

- [x] 建立筆記列表
- [x] 支援新增、編輯、刪除
- [x] 支援標題、描述、日期與分類
- [x] 分類篩選（生活／工作／學習）

### M5 收支紀錄

- [x] 建立年曆入口
- [x] 建立月份列表
- [x] 支援收入與支出紀錄
- [x] 依分類統計金額
- [x] 建立簡易圓餅圖

### M6 PWA 與手機測試

- Service Worker 策略：Cache-First（靜態資源：HTML / JS / CSS / icons）。
- 不做 Background Sync、不做 Push Notification。
- `localStorage` 由瀏覽器獨立管理，不在 Service Worker 快取範圍內。
- 離線驗收：斷網後仍可開啟已安裝的 PWA 並讀寫 `localStorage` 資料。

- [x] 補齊 manifest 設定
- [x] 實作並註冊 Service Worker
- [x] 驗證 iPhone Safari 加到主畫面（區網 HTTP 測試通過；正式離線改以 GitHub Pages HTTPS）
- [x] 斷網測試：App Shell 可載入、資料可讀寫（需 HTTPS 部署後自主畫面驗收）
- [x] 測試手機尺寸、觸控操作
- [x] 更新 `docs/process/Project_Log.md` 與 `docs/agent/AGENTS.md` 進度

### M7 GitHub Pages 部署

- 正式網址：`https://dancerpizza.github.io/PWAforMyself/`
- `experiments.baseUrl`：`/PWAforMyself`
- push `main` 後由 GitHub Actions 自動 build 並部署 `dist/`

- [x] 新增 `.github/workflows/deploy-pages.yml`
- [x] 設定 `baseUrl`、相對路徑 manifest / Service Worker
- [x] `dist/.nojekyll`（避免 Jekyll 忽略 `_expo`）
- [ ] 於 GitHub Settings → Pages 選擇 **GitHub Actions** 來源（首次需手動）
