# Project Log

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
