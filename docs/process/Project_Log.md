# Project Log

## [2026-07-21]

- [文件] 對外 docs 濃縮；`AGENTS.md` 與 Cursor skill 改為本機保留、不進 GitHub
- [資源] PWA icon 更新；移除未使用的 `public/notes.png`（若尚未入庫一併提交）

## [2026-07-20]

- [實機] PWA-LAYOUT 驗收通過：輸入不再觸發版面放大
- [結案] PWA-LAYOUT；無開放已知問題
- [資源] 更新 icon（`public/icon-192.png`、`public/icon-512.png`、`assets/`）
- [文件] 專案結案狀態同步

## [2026-07-18]

- [修正] PWA-LAYOUT：輸入字級 16px + viewport 停用縮放；保留表單垂直定位
- [技術] `sw.js` `CACHE_NAME` → `v4`

## [2026-07-13]

- [實機] 方向 D 通過：冷啟動可滑動、鍵盤／表單正常
- [實機] 斷網重開後 `localStorage`／IndexedDB 仍在
- [結案] PWA-001、PWA-002
- [修復] document 自然捲動；`sw.js` → `v3`

### PWA-SCROLL 回顧（07-07～07-13）

> iPhone Safari 獨立 PWA。僅捲動／鍵盤體驗異常，不影響資料。

| 編號 | 現象 | 結果 |
|------|------|------|
| **PWA-001** | 冷啟動後功能頁無法滑動 | 方向 D：改 document 自然捲動 |
| **PWA-002** | 鍵盤 focus 拉回頂部 | 方向 A：移除 focus／visualViewport 的 `scrollTo(0,0)` |

根因摘要：內層 `overflow: auto` 在 iOS PWA 冷啟動不可靠。解法見當日修復項；備忘：優先 document 捲動，避免 focus 時強制 `scrollTo(0,0)`。

## [2026-07-12]

- [修復] 方向 A（PWA-002）；`?noRecover=1` 對照；`sw.js` → `v2`

## [2026-07-07]

- [測試] Jest storage／備份；Pages HTTPS 安裝與離線讀寫通過
- [功能] 批次 C–E（圖片、表單 UX、JSON 備份）

## 歷史摘要（2026-06-30～07-06）

| 日期 | 重點 |
|------|------|
| 07-06 | M6 結案；Pages workflow 就緒 |
| 07-05 | 遷移桌機；manifest／SW／`build:web` |
| 07-04 | M3 代辦、M4 筆記、M5 收支 |
| 06-30 | 專案啟動：Expo、localStorage、文件架構 |
