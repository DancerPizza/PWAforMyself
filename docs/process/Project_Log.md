# Project Log

## [2026-06-30 | 19:39]

- 確認產品方向改為個人離線使用的 PWA 極簡工具集。
- MVP 以三個獨立功能為主：極簡代辦事項、簡易筆記本、收支紀錄。
- 確認資料優先存於手機本地端，初期不做帳號、雲端同步、自動提醒或原生通知。
- 確認專案文件需新增 `docs/product/Spec.md`、`docs/process/workflow.md`、`.cursorrules.md`，並更新 `docs/agent/AGENTS.md`。
- 確認操作規則調整為：只有破壞性指令需再次詢問；其餘決策使用選項彈窗讓使用者點選。
- 檢查到 `docs/README.md` 與舊功能規格文件仍保留舊原生通知方向，使用者選擇更新為 PWA 方向。

## [2026-06-30 | 19:45]

- 確認 iPhone 型號、iOS 版本與主要瀏覽器屬於建議提供資訊，只需提供一次或在變更時更新。
- 固定每次開工或新 context window 的讀檔順序：`.cursorrules.md`、`docs/product/Spec.md`、`docs/process/workflow.md`、`docs/agent/AGENTS.md`、`docs/process/Project_Log.md`。
- 若任務涉及 PWA 開發流程，需讀取 `.cursor/skills/pwa-dev-workflow/SKILL.md`。
- 確認允許 Agent 在專案根目錄內建立必要資料夾與整理專案結構，但尚未開始開發前不建立過多空資料夾。

## [2026-06-30 | 20:02]

- 使用者已刪除舊功能規格文件。
- 更新 `docs/README.md`、`docs/product/Spec.md`、`docs/agent/AGENTS.md`，移除已刪除文件索引。
- 同步將行事曆式描述改為日期列表或月份列表，符合目前不需要行事曆相關功能的方向。

## [2026-06-30 | 20:16]

- 確認 PC 已安裝 Node.js `v24.18.0` 與 npm `11.16.0`。
- 確認 iPhone 已安裝 Expo Go，可作為後續即時預覽工具。
- 依使用者確認建立 Markdown 分類結構：`docs/product/`、`docs/process/`、`docs/agent/`。
- 將產品規格、流程、日誌與 Agent 指南移入對應分類，保留 `.cursorrules.md` 於專案根目錄。

## [2026-06-30 | 20:32]

- 釐清產品方向：不做行事曆提醒功能，但三大功能頁仍需要月曆與年曆作為資料瀏覽 UI。
- 更新 `docs/product/Spec.md`、`docs/agent/AGENTS.md` 與 `docs/README.md`，恢復代辦月曆檢視與收支年曆入口描述。

## [2026-06-30 | 20:45]

- 使用官方 `create-expo-app` 嘗試在根目錄建立專案，但工具拒絕在已有 `.cursor` 與 `.cursorrules.md` 的非空目錄執行。
- 依使用者選擇，改用手動最小 Expo TypeScript 骨架建立於專案根目錄。
- 新增 npm / Expo 基礎設定、TypeScript 設定、App 入口與 `src/` 主畫面結構。
- 建立主畫面三個 MVP 功能入口：極簡代辦事項、簡易筆記本、收支紀錄。
- Web 輸出設定使用單頁模式，避免未導入 `expo-router` 時觸發靜態渲染錯誤。
- 已執行 `npm run typecheck` 與 `npm run export:web`，兩者皆通過。
- npm install 回報 10 個 moderate vulnerabilities，尚未執行 `npm audit fix`，避免自動改動依賴版本。

## [2026-06-30 | 22:45]

- 手機掃描 Expo Tunnel QR Code 時顯示 Expo 版本過舊，暫不阻塞 MVP 開發，先以 Web 預覽確認畫面。
- 新增三項 MVP 資料型別：`TodoItem`、`NoteItem`、`ExpenseItem`。
- 新增 `localStorage` 共用 helper，支援 JSON 讀取、寫入、移除、集合更新與集合刪除。
- 新增三項功能的 storage key，集中管理代辦、筆記與收支紀錄的本地儲存名稱。
- 已執行 `npm run typecheck`，檢查通過。

## [2026-06-30 | 23:08]

- 檢查 Node.js、npm、Expo CLI 與 Expo 相關依賴，確認 Node.js `v24.18.0`、npm `11.16.0`、Expo CLI `56.1.16`。
- `npx expo install --check` 初次顯示 `react`、`react-dom`、`react-native` 版本高於 Expo SDK 56 預期版本。
- 依 Expo 官方指令執行 `npx expo install react react-dom react-native`，將 React / React DOM 對齊 `19.2.3`，React Native 對齊 `0.85.3`。
- `expo install` 安裝後段曾出現 `@expo/cli` 內部模組缺失錯誤，但重新檢查後 `npx expo install --check` 已通過，`npx expo --version` 可正常執行。
- 修正 Web 預覽中的 `shadow*` style deprecation warning，改用 `boxShadow`。
- 已執行 `npm run typecheck`、`npx expo install --check`、`npx expo --version` 與 `npm run export:web`，皆通過。
- `npm audit` 仍顯示 11 個 moderate vulnerabilities，主要來自 Expo CLI / `@expo/ngrok` 相關依賴；因 `npm audit fix --force` 會降級 Expo 至舊版，暫不執行。
- npm 目前會顯示 `Unknown env config "devdir"` 警告，暫不阻塞專案開發。
