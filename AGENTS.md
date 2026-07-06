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
- PWA 優先使用瀏覽器本地能力，不引入不必要的原生功能。
- 日常開發預覽以 Web（`npm run web`）與瀏覽器開發工具模擬 iPhone 為主。
- Expo Go / Tunnel 因 App Store 無最新版，不再作為日常預覽方式。

## 操作確認規則

- 只有破壞性指令需要再次詢問使用者。
- 破壞性指令包含刪除、覆寫、重命名、不可逆 Git 操作、清理檔案、批次移動檔案。
- 執行破壞性指令前，必須列出完整影響清單、操作動機與風險，等待使用者明確回覆「確認」或「ok」。
- 非破壞性指令不需要等待使用者文字確認，可直接執行。
- 非破壞性決策若有多種合理方案，只需使用選項彈窗讓使用者點選，不需再等待「確認」或「ok」。
- 禁止對專案根目錄以外的路徑執行寫入或刪除。

## 開工讀檔規則

本節為開工讀檔的**唯一權威來源**；其他文件僅引用，不重複定義順序。

1. 讀取 `AGENTS.md`（本檔）。
2. 讀取 `docs/product/Spec.md`。
3. 讀取 `docs/process/workflow.md`（位於 `docs/process/`，條列式開發與 Git 步驟；若檔案不存在，回報使用者）。
4. 讀取 `docs/process/Project_Log.md`。
5. 若任務涉及 PWA 開發流程，讀取 `.cursor/skills/pwa-dev-workflow/SKILL.md`。

### 文件衝突優先序

- 文件內容衝突：`AGENTS.md` > `docs/product/Spec.md` > `.cursor/skills/pwa-dev-workflow/SKILL.md` > `docs/process/workflow.md`。
- 操作規則衝突：以本檔 §操作確認規則 為準。
- 仍不確定：使用選項彈窗詢問使用者。

## 技術選用

| 類別 | 選用 | 目的 |
| ------ | ------ | ------ |
| App 框架 | Expo | 快速建立跨平台專案與 Web 輸出 |
| UI 技術 | React / React Native Web | 建立手機優先的跨平台介面 |
| 語言 | TypeScript | 維持資料模型與模組邊界清楚 |
| PWA | Manifest + Service Worker | 支援安裝與基本離線能力 |
| MVP 儲存 | localStorage | 儲存簡單 JSON 資料 |
| 進階儲存 | IndexedDB | 第二階段處理圖片、畫布或大量資料 |
| 手機預覽 | Web Preview + Browser DevTools | 日常開發以瀏覽器模擬 iPhone；實機 PWA 測試於 M6 完成 |

## 開發環境

- 開發機：桌機（2026-07-05 自筆電遷移）。
- Node.js `v22.23.1`、npm `10.9.8`。
- Expo SDK `56.0.14`、Expo CLI `56.1.18`。
- React `19.2.3`、React DOM `19.2.3`、React Native `0.85.3`，已通過 `npx expo install --check`。
- PC 已安裝 Git `2.51.0` 與 GitHub CLI。
- 日常預覽：`npm run web` + 瀏覽器開發工具；Expo Go 因 App Store 無最新版，不再使用。
- 暫時性環境警告與 audit 紀錄見 `docs/process/Project_Log.md`。
- 若 Expo 與 Node.js 24 發生相容性問題，改用 Node.js LTS 22。

## 開發原則

- 先完成 MVP，再提出優化方向。
- 優先修改現有檔案，不無故新增冗餘檔案或抽象。
- 優先使用 Expo、React、React Native Web、TypeScript 與瀏覽器既有能力。
- MVP 階段優先使用 `localStorage` 儲存簡單 JSON 資料；圖片、畫布或較大資料需求明確後，再評估 IndexedDB。
- 新增套件前，先確認是否已有內建功能或現有依賴可完成需求。
- 避免混入原生通知、SQLite、帳號系統、雲端同步、複雜狀態管理或大型 UI 套件。
- 若有多種解法且會明顯改變實作方向，使用選項彈窗交由使用者決定。
- 程式碼與變數命名使用英文，註解使用繁體中文，且只在邏輯不直觀時加入。
- 文件使用繁體中文，保持條列清楚、避免長篇散文。

## 裝置資訊

- iPhone 17。
- iOS ver: 26.5。
- 主要瀏覽器為 Safari。
- 裝置資訊用於判斷 PWA 安裝、Safari 相容性、本地儲存、圖片、畫布與觸控行為。
- iPhone 型號、iOS 版本與主要瀏覽器建議提供一次，變更時再更新。

## 專案結構

- 允許 Agent 在專案根目錄內建立必要資料夾與整理專案結構。
- 尚未開始開發前，不為了形式建立過多空資料夾。
- 文件分類於 `docs/product/`、`docs/process/`。
- `AGENTS.md` 保留於專案根目錄，作為唯一跨工具權威。
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

- `docs/product/Spec.md`：產品目的、MVP 範圍、技術棧、資料模型、驗收條件。
- `docs/process/Project_Log.md`：以 `[yyyy-mm-dd]` 區塊記錄實作日誌，同類進度以 `[標籤]` 合併。
- `docs/process/workflow.md`：可重複的 Git 與開發步驟。
- `AGENTS.md`（本檔）：操作規則、讀檔順序、Agent 準則與目前進度。
- 每完成里程碑或改變產品方向，需同步更新相關文件。

## 專案進度

### M0 文件與規則整理

- [x] 建立 `docs/process/Project_Log.md`
- [x] 建立 `docs/product/Spec.md`
- [x] 建立根目錄 `AGENTS.md`（合併原 `.cursorrules.md` 與 `docs/agent/AGENTS.md`）
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
- [x] 驗證 iPhone Safari 加到主畫面（區網 HTTP 功能驗證通過）
- [x] 測試手機尺寸、觸控操作、表單驗證、首頁版面
- [x] 更新 `docs/process/Project_Log.md` 與 `AGENTS.md` 進度

## 未完成進度（依批次）

> MVP 功能（M0–M6 程式）已完成。以下為待辦批次，建議一次交付一整批給 Agent。

### 批次 A — M6 收尾

- [ ] 正式 HTTPS 離線驗收（依批次 B 上線後執行）

### 批次 B — GitHub Pages 部署（下次開工前，優先）

- 正式網址（上線後）：`https://dancerpizza.github.io/PWAforMyself/`
- `experiments.baseUrl`：`/PWAforMyself`
- **目前狀態**：repo 為 Private，免費帳號無法啟用 Pages；workflow 已就緒，尚未部署。

- [x] 新增 `.github/workflows/deploy-pages.yml`
- [x] 設定 `baseUrl`、相對路徑 manifest / Service Worker
- [x] `dist/.nojekyll`（避免 Jekyll 忽略 `_expo`）
- [ ] 將 repo 改為 **Public**（Settings → General → Change visibility）
- [ ] Settings → Pages → Source 選 **GitHub Actions**
- [ ] push `main` 後確認 Actions 部署成功
- [ ] iPhone Safari 開啟 HTTPS 網址 → 加入主畫面
- [ ] 斷網驗收：關閉 PC 後仍可從主畫面開啟並讀寫資料

### 批次 C — 筆記圖片（第二階段）

- [ ] 建立 IndexedDB helper（圖片 blob 儲存）
- [ ] 筆記表單支援選擇圖片（`<input type="file">`）
- [ ] 筆記列表顯示縮圖；`NoteItem.imageIds` 接上
- 不做：拍照、畫筆、雲端同步

### 批次 D — UX 拋光

- [ ] 刪除代辦／筆記／收支前確認對話框
- [ ] 日期欄位格式提示強化（可選：日期選擇器）
- [ ] 共用表單欄位元件（可選，減少三畫面重複）

### 批次 E — 資料匯出匯入

- [ ] 匯出 localStorage JSON 備份
- [ ] 匯入 JSON 還原（覆蓋前需確認）
