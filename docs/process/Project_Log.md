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
