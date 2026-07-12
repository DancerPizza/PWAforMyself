# Cursor Agent 指南 - PWA 極簡工具集

> `last_updated`: 2026-07-07

## 角色定位

- 你是一位熟悉 Expo、React、React Native Web、TypeScript 與 PWA 的資深前端開發協作者。
- 你的目標是協助建立個人離線使用的極簡 PWA 工具集。
- 專案以 MVP、簡潔資料結構、手機瀏覽器體驗與本地儲存為優先。

## 核心產品方向

- 主畫面提供三個功能入口（極簡代辦事項、簡易筆記本、收支紀錄）與 JSON 匯出／匯入備份。
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

### 程式碼地圖（接手用）

| 路徑 | 用途 |
|------|------|
| `App.tsx` | 路由（home / todos / notes / expenses）、`storageVersion` 匯入刷新 |
| `src/screens/` | `HomeScreen`、`TodoScreen`、`NoteScreen`、`ExpenseScreen` |
| `src/storage/` | `localStorage` helper、`todos`/`notes`/`expenses`、`backup.ts`、`noteImages.ts`（IndexedDB） |
| `src/components/form/` | `FormField`、`FormDateField`、`formStyles` |
| `src/components/notes/` | `NoteImagePicker`、`NoteImageThumb`、`NoteImageCarousel`、`NoteDetailView`（`.web.tsx` 為 Web 實作） |
| `src/components/BackupActions.web.tsx` | 主畫面匯出／匯入 JSON |
| `src/components/ScreenScroll.web.tsx` | Web document 自然捲動介面（方向 D） |
| `src/constants/noteImages.ts` | `MAX_NOTE_IMAGES = 3` |
| `public/` | `manifest.json`、`sw.js`、`index.html`（PWA 標籤與 document 捲動外殼） |
| `.github/workflows/deploy-pages.yml` | GitHub Pages 自動部署 |

## 下次開工摘要

> 新 Context Window 先讀本節 + §已知問題，再依 §開工讀檔規則 補讀其他文件。

- **產品狀態**：M0–M6 與批次 A–E **均已完成**；無預設待辦批次。
- **正式網址**：https://dancerpizza.github.io/PWAforMyself/（`baseUrl`：`/PWAforMyself`）
- **日常開發**：`npm run web`；上線：`npm run build:web` → push `main` → Actions 部署
- **主畫面**：三張功能卡僅顯示標題；比例 flex **75:10:45**（卡 25%×3、間隔 10%、匯入匯出 15%）
- **儲存**：代辦／筆記／收支 → `localStorage`；筆記圖片 blob → IndexedDB（`imageIds` 在 `NoteItem`）
- **備份限制**：JSON 匯出含 `imageIds`，**不含**圖片 blob；換裝置匯入後需重新選圖
- **PWA-SCROLL**：PWA-002 已實機確認修復；PWA-001 的 `?noRecover=1` 對照仍重現，已改採方向 D（document 自然捲動）並待部署實機驗證
- **測試**：`npm test`（20 項）；代辦／筆記／收支／備份邏輯
- **Git**（2026-07-13）：`main` 最新 `be75aed`；工作區含方向 D 修復與文件更新待提交

### 後續可選方向（無優先順序）

- **部署並實機驗證方向 D**（PWA-001 document 自然捲動）
- 備份匯出納入 IndexedDB 圖片（或 ZIP）
- 新功能或 UI 微調（由使用者指定）

## 功能邊界

### 極簡代辦事項

- 月曆檢視。
- 有代辦的日期需標色或標記。
- 點選日期後顯示當日代辦。
- 支援新增、編輯、完成與刪除。

### 簡易筆記本

- 列表檢視。
- 支援標題、描述、日期、分類。
- 支援選擇圖片（最多 3 張，IndexedDB）、列表縮圖、**查看**模式（上半圖片左右滑動、下半詳情）。
- 不做：拍照、畫筆、雲端同步。

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

## 專案進度（摘要）

> 細項日誌見 `docs/process/Project_Log.md`；驗收條件見 `docs/product/Spec.md`。

| 階段 | 狀態 | 重點 |
|------|------|------|
| M0 文件 | ✅ | Spec、workflow、AGENTS、skill |
| M1 骨架 | ✅ | Expo TS、Web/PWA、主畫面三入口 |
| M2 儲存 | ✅ | localStorage helper、三功能型別 |
| M3 代辦 | ✅ | 月曆、CRUD、過期高亮 |
| M4 筆記 | ✅ | 列表、分類、IndexedDB 圖片、查看模式 |
| M5 收支 | ✅ | 年曆、CRUD、圓餅圖 |
| M6 PWA | ✅ | manifest、SW、iPhone 安裝、離線讀寫 |
| 批次 A | ✅ | HTTPS 離線驗收（捲動見已知問題） |
| 批次 B | ✅ | GitHub Pages 部署上線 |
| 批次 C | ✅ | 筆記圖片（最多 3 張） |
| 批次 D | ✅ | 刪除確認、共用表單元件 |
| 批次 E | ✅ | JSON 匯出／匯入備份 |
| 測試 | ✅ | Jest 20 項（storage 邏輯） |

**MVP 已結案**；無預設待辦批次。

### 已知問題

#### 問題群：iOS 獨立 PWA 捲動（PWA-SCROLL）

**共同環境**：iPhone 17、iOS 26.5、Safari 獨立 PWA、HTTPS（含 GitHub Pages）

**相關程式**：

- `public/index.html` — `html`／`body`／`#root` 使用 document 自然捲動
- `src/components/ScreenScroll.web.tsx` — Web 的 `scrollTo` 委派給 `window`
- `src/hooks/useScrollToSection.ts` — 表單展開時捲至指定區段

**不影響**：`localStorage`／IndexedDB 讀寫、多數按鈕操作

| 編號 | 現象 | 觸發條件 | 狀態 |
|------|------|----------|------|
| **PWA-001** | 功能頁無法上下滑動 | 從主畫面重開 App 後進入代辦／筆記／收支頁 | **方向 D 待實機驗證**；改為 document 自然捲動 |
| **PWA-002** | 鍵盤／focus 後畫面被拉回頂部 | 點輸入框開啟鍵盤後輸入 | **已修復**；2026-07-13 實機確認不再重現 |

**拆解與關聯**：

1. **PWA-001（冷啟動捲動失效）**
   - `?noRecover=1` 完全停用恢復碼後仍重現，排除恢復碼副作用。
   - 推測為 iOS 獨立 PWA 對內層 `overflow: auto` 容器未正確啟用 touch 手勢。
   - 點輸入框會觸發 `focus`，瀏覽器重新佈局後捲動**暫時**恢復；關閉 App 再重開則重現。
2. **PWA-002（鍵盤／focus 鎖回頂部）**
   - 方向 A 移除 `focusin`／`visualViewport` 的 document reset 後，實機輸入不再被拉回頂部。
   - 2026-07-13 標記為已修復。
3. **表單 `scrollToSection`**
   - 方向 D 改由 `window.scrollTo` 執行，需在實機驗證定位。

**需你協助的實機驗證**（部署後於 iPhone 獨立 PWA 測試）：

1. 關閉再重開主畫面 PWA，依序進入代辦／筆記／收支頁，確認可直接上下滑動。
2. 展開新增／編輯表單，確認自動定位與鍵盤輸入正常。
3. 開啟筆記查看模式，確認圖片區與詳情區仍維持預期比例。
