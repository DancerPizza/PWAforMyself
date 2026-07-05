# Project Log

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
