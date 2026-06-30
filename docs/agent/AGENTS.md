# Cursor Agent 指南 - PWA 極簡工具集

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

- 只有破壞性指令需要再次詢問使用者。
- 破壞性指令包含刪除、覆寫、重命名、不可逆 Git 操作、清理檔案、批次移動檔案。
- 執行破壞性指令前，必須列出完整影響清單、操作動機與風險，等待使用者明確回覆「確認」或「ok」。
- 非破壞性決策若有多種合理方案，使用選項彈窗讓使用者點選。
- 禁止對專案根目錄以外的路徑執行寫入或刪除。

## 技術選用

| 類別 | 選用 | 目的 |
| ------ | ------ | ------ |
| App 框架 | Expo | 快速建立跨平台專案與 Web 輸出 |
| UI 技術 | React / React Native Web | 建立手機優先的跨平台介面 |
| 語言 | TypeScript | 維持資料模型與模組邊界清楚 |
| PWA | Manifest + Service Worker | 支援安裝與基本離線能力 |
| MVP 儲存 | localStorage | 儲存簡單 JSON 資料 |
| 進階儲存 | IndexedDB | 第二階段處理圖片、畫布或大量資料 |
| 手機預覽 | Expo Go / Expo Tunnel / Web Preview | 讓 iPhone 即時預覽開發成果 |

## 開發環境

- PC 已安裝 Node.js `v24.18.0` 與 npm `11.16.0`。
- Expo SDK `56.0.12`，Expo CLI `56.1.16`。
- React `19.2.3`、React DOM `19.2.3`、React Native `0.85.3`，已通過 `npx expo install --check`。
- PC 已安裝 Git 與 GitHub CLI。
- iPhone 已安裝 Expo Go。
- npm 目前會顯示 `Unknown env config "devdir"` 警告，暫不阻塞開發。
- `npm audit` 的 moderate vulnerabilities 主要來自 Expo CLI / `@expo/ngrok` 依賴，避免使用 `npm audit fix --force` 造成 Expo 降級。
- 若 Expo 與 Node.js 24 發生相容性問題，改用 Node.js LTS 22。

## 開發核心原則

- 先完成 MVP，再提出優化方向。
- 優先修改現有檔案，不新增冗餘抽象。
- 優先使用 Expo、React 與瀏覽器既有能力。
- 新增套件前先確認是否已有內建功能或現有依賴可完成需求。
- 避免混入原生通知、SQLite、帳號系統、雲端同步與大型狀態管理。
- 程式碼與變數命名使用英文，註解使用繁體中文。

## 開工與 Context 流程

- 每次開工或新 context window，先讀取 `.cursorrules.md`、`docs/product/Spec.md`、`docs/process/workflow.md`。
- 接著讀取 `docs/agent/AGENTS.md` 與 `docs/process/Project_Log.md`。
- 若任務涉及 PWA 開發流程，讀取 `.cursor/skills/pwa-dev-workflow/SKILL.md`。
- 若文件資訊衝突，以 `.cursorrules.md` 的操作規則與 `docs/product/Spec.md` 的產品方向為優先。
- 若仍不確定，使用選項彈窗讓使用者決定。

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
- 分類金額長條圖。

## 文件維護

- `docs/product/Spec.md` 記錄產品目的、技術棧、工具選用與階段性任務。
- `docs/process/Project_Log.md` 以 `[yyyy-mm-dd | hh:mm]` 區塊記錄實作日誌。
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
- [ ] 用 iPhone Expo Go 即時預覽

### M2 本地儲存

- [x] 建立共用 storage helper
- [x] 定義三項功能資料型別
- [x] 完成 localStorage 讀寫、更新與刪除

### M3 極簡代辦事項

- [ ] 建立月曆檢視
- [ ] 標示有代辦的日期
- [ ] 點選日期後顯示當日代辦
- [ ] 支援新增、編輯、完成與刪除

### M4 簡易筆記本

- [ ] 建立筆記列表
- [ ] 支援新增、編輯、刪除
- [ ] 支援標題、描述、日期與分類

### M5 收支紀錄

- [ ] 建立年曆入口
- [ ] 建立月份列表
- [ ] 支援收入與支出紀錄
- [ ] 依分類統計金額
- [ ] 建立簡易長條圖

### M6 PWA 與手機測試

- [ ] 補齊 manifest 設定
- [ ] 驗證 iPhone Safari 加到主畫面
- [ ] 測試手機尺寸、觸控操作與本地儲存
- [ ] 更新 `docs/process/Project_Log.md` 與 `docs/agent/AGENTS.md` 進度
