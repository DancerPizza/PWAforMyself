# Project Log

## [2026-07-13]

- [實機] PWA-002 已確認修復：開啟鍵盤輸入時不再被拉回頂部
- [診斷] PWA-001 在 `?noRecover=1` 完全停用恢復碼後仍重現，確認不是恢復碼副作用；點輸入框後滑動與縮放才恢復，推測為內層 overflow 的 touch 手勢層失效
- [修復候選] 採方向 D：Web 改用 document 自然捲動，移除 `html`／`body`／`#root` 的垂直捲動鎖定及舊恢復機制
- [技術] `ScreenScroll.web.tsx` 改由 `window.scrollTo` 定位；路由切換時回到頁首；`sw.js` `CACHE_NAME` → `v3`
- [待辦] 部署後實機驗證 PWA-001、表單自動定位、鍵盤輸入與筆記查看模式版面

## [2026-07-12]

- [修復] PWA-SCROLL 方向 A：`pwaScrollRecovery.ts` 與 `index.html` 移除 `focusin` staggered reset 與 `visualViewport` 的 `scrollTo(0,0)`（PWA-002 對抗來源），僅保留 `kickScrollContainers`
- [新增] 診斷旗標 `?noRecover=1` 完全停用捲動恢復，供 PWA-001 對照實驗
- [技術] `sw.js` `CACHE_NAME` → `v2`，避免實機讀到舊 `index.html`
- [測試] PWA-SCROLL 測試改寫為驗證新行為（27 項全通過）；typecheck 通過
- [待辦] 實機驗證 PWA-002 是否消失、PWA-001 是否仍存在（含 `?noRecover=1` 對照）

## [2026-07-07]

- [測試] 新增 Jest（`npm test`）26 項：代辦／筆記／收支／備份全通過；PWA-SCROLL 迴歸測試確認 `scrollTo(0,0)` 行為
- [文件] AGENTS 進度濃縮為摘要表；PWA-SCROLL 問題群拆解；md 文件繼續版控
- [已知問題] **PWA-002**：鍵盤／focus 後畫面鎖回頂部；疑與 `pwaScrollRecovery` 衝突
- [Git] `c390b0c`：UI、備份功能、已知問題更新已 push
- [部署] 批次 B：GitHub Pages HTTPS、iPhone 主畫面安裝通過
- [驗收] 批次 A：離線讀寫 `localStorage` 通過
- [功能] 批次 C–E：筆記圖片／查看模式、UX 表單、JSON 備份；主畫面 flex 75:10:45
- [技術] `ScreenScroll`、`pwaScrollRecovery`（PWA-001 緩解，效果不足）

## 歷史摘要（2026-06-30～07-06）

| 日期 | 重點 |
|------|------|
| 07-06 | 文件合併為根目錄 `AGENTS.md`；M6 結案；批次 B workflow 就緒 |
| 07-05 | 開發機遷移桌機；M6 manifest／SW／`build:web`；環境 audit 紀錄 |
| 07-04 | M3 代辦、M4 筆記、M5 收支完成 |
| 06-30 | 專案啟動：Expo 骨架、M2 localStorage、文件架構 |
