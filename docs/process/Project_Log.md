# Project Log

## [2026-07-07]

- [部署] 批次 B 完成：GitHub Pages HTTPS 上線、iPhone 主畫面安裝通過
- [驗收] 批次 A 完成：離線讀寫 `localStorage` 通過（滑動見 PWA-001）
- [已知問題] **PWA-001**：獨立 PWA 重開後功能頁無法滑動；點輸入框後恢復；多輪修復未解，暫緩
- [功能] 批次 D 完成：`FormField`、`FormDateField`、刪除確認
- [功能] 批次 E 完成：主畫面匯出／匯入 JSON 備份（覆蓋前確認）
- [畫面] 主畫面比例：功能卡 25%×3、間隔 10%、匯入匯出列 15%；移除狀態標籤與副標，卡面僅標題
- [功能] 批次 C 完成：筆記 IndexedDB 圖片、選圖、列表縮圖
- [功能] 筆記「查看」模式：上半圖片左右滑動、下半詳情與返回；每則最多 3 張圖
- [技術] 新增 `ScreenScroll.web.tsx`、`pwaScrollRecovery`（PWA-001 緩解嘗試，效果不足）
- [文件] 同步 AGENTS／Spec／README／skill；新增 §下次開工摘要、程式碼地圖
- [Git] `origin/main` 上四筆重複 commit「修復重啟app後無法滑動」；批次 C–E 等變更尚在工作區未提交

## [2026-07-06]

- [文件] 文件架構遷移：`.cursorrules.md` 與 `docs/agent/AGENTS.md` 合併為根目錄 `AGENTS.md`（單一權威）
- [文件] `Spec.md` 移除 M0–M6／批次 A–E checklist，改保留資料模型與驗收條件；進度僅維護於 `AGENTS.md`
- [文件] 新衝突優先序：`AGENTS.md` > `Spec.md` > `SKILL.md` > `workflow.md`；workflow／SKILL／README 引用已更新
- [功能] M6 結案：實機版面、驗證提醒、圖示替換、表單捲動完成
- [功能] M7 程式就緒：Actions workflow、`baseUrl`、`.nojekyll`；**尚未實際部署**
- [待辦] 未完成進度改以批次 A–E 記錄於 AGENTS／Spec
- [待辦] **批次 B**（優先）：repo 改 Public → Pages 啟用 → HTTPS 上線 → 斷網驗收
- [待辦] **批次 A**：HTTPS 離線驗收（依批次 B）
- [待辦] **批次 C–E**：筆記圖片、UX 拋光、資料匯出匯入（MVP 後）

## [2026-07-05]

- [環境] 開發機自筆電遷移至桌機；`npm install` 完成，typecheck 通過
- [環境] 桌機 Node.js `v22.23.1`、npm `10.9.8`、Git `2.51.0`；Expo CLI `56.1.18`、SDK `56.0.14`
- [環境] 與筆電環境一致，無版本衝突；`npx expo install --check` 通過
- [環境] Expo Go 因 App Store 無最新版，日常預覽改 Web only；實機 PWA 測試留待 M6
- [環境] `npm audit` 11 moderate vulnerabilities（Expo CLI / `@expo/ngrok`）；避免 `npm audit fix --force`
- [環境] npm `Unknown env config "devdir"` 警告，暫不阻塞開發
- [文件] 統一文件衝突優先序、開工讀檔權威來源、M6 Service Worker 策略
- [功能] M6：`public/manifest.json`、`public/sw.js`（Cache-First 靜態資源）、`public/index.html` PWA 標籤
- [功能] `npm run build:web` 產出 `dist/` 並複製 PWA 靜態檔；`assets/icon-512.png` 作為 App 圖示
- [功能] 待實機驗證：iPhone Safari 加到主畫面、斷網讀寫 localStorage

## [2026-07-04]

- [環境] 本機筆電完成依賴安裝與 typecheck；Node.js `v22.23.1`、npm `10.9.8`
- [環境] Expo Go 無法於 App Store 更新，改以 Edge Web 開發工具預覽
- [功能] M3 極簡代辦事項：月曆、月份列表由近至遠、CRUD、過期未完成高亮
- [功能] M4 簡易筆記本：列表、CRUD、分類（生活／工作／學習）、分類篩選
- [功能] M5 收支紀錄：年曆入口、月份列表、收入／支出 CRUD、支出圓餅圖
- [畫面] 代辦過期高亮、收支備註欄位移至金額上方、長條圖改圓餅圖
- [文件] 更新 README UI 索引、AGENTS／Spec 進度；精簡日誌格式
- [新增] `src/theme.ts`、`TodoScreen`、`NoteScreen`、`ExpenseScreen`、`ExpensePieChart` 等模組

## [2026-06-30]

- [文件] 確認 PWA 方向、MVP 三功能、本地儲存、操作規則與讀檔順序
- [文件] 建立 Spec／workflow／AGENTS／skill；Markdown 分類至 `docs/product`、`docs/process`、`docs/agent`
- [文件] 釐清月曆／年曆為瀏覽 UI、非行事曆提醒；移除舊規格索引
- [環境] 桌機 Node.js `v24.18.0`、npm `11.16.0`；React／RN 對齊 Expo SDK 56
- [環境] npm audit、devdir 警告記錄；Expo Tunnel QR 版本過舊，改 Web 預覽
- [功能] 建立 Expo TypeScript 骨架、主畫面三入口、Web 單頁輸出
- [功能] M2 localStorage helper、三功能資料型別與 storage keys
- [畫面] Web 預覽 `shadow*` 改 `boxShadow`
