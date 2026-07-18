# Project Log

## [2026-07-18]

- [修正] PWA-LAYOUT：所有文字輸入框字級由 15px 調整為 16px，並以 viewport 停用頁面縮放；保留表單垂直定位與鍵盤行為
- [技術] `sw.js` `CACHE_NAME` → `v4`，確保實機載入新版靜態資源
- [待驗收] 部署後於 iPhone 確認輸入代辦、筆記與收支時不再觸發版面放大

## [2026-07-13]

- [實機] 方向 D 部署後驗收通過：冷啟動可滑動、表單定位與鍵盤輸入正常、筆記查看模式正常
- [實機] 斷網重開後 `localStorage`／IndexedDB 資料仍在
- [結案] PWA-001（document 自然捲動）、PWA-002（移除 focus reset）均已修復
- [修復] 方向 D：移除內層 overflow 捲動與舊恢復機制；`sw.js` `CACHE_NAME` → `v3`
- [已知] **PWA-LAYOUT**：版面偶爾會自己稍微放大；下一待辦為版面微調
- [文件] 新增 §PWA-SCROLL 問題回顧，記錄前因後果與解法

### PWA-SCROLL 問題回顧（2026-07-07～07-13）

> iPhone 17、iOS 26.5、Safari 獨立 PWA、GitHub Pages HTTPS。功能與離線讀寫不受影響，僅捲動與鍵盤輸入體驗異常。

#### 現象

| 編號 | 現象 | 觸發條件 |
|------|------|----------|
| **PWA-001** | 代辦／筆記／收支頁無法上下滑動 | 從主畫面重開 App 後進入功能頁 |
| **PWA-002** | 開啟鍵盤輸入時畫面被拉回頂部 | 在頁面下方點輸入框輸入 |

兩者關聯：PWA-001 發生時，點一下輸入框觸發 `focus` 後捲動（甚至縮放）會暫時恢復；關閉 App 再重開則重現。

#### 舊架構（問題根源）

採「固定外殼 + 內層捲動」：

```
html / body / #root  → overflow: hidden（頁面本身不捲）
    └── ScreenScroll div  → overflowY: auto（實際捲動發生在此）
```

- `ScreenScroll.web.tsx` 以內層 `<div data-pwa-scroll="true">` 承擔捲動。
- `pwaScrollRecovery.ts` 與 `index.html` 內嵌腳本在 `pageshow`／`visibilitychange`／`focusin` 時執行恢復。

推測根因：iOS 獨立 PWA 冷啟動時，WebKit 對內層 `overflow: auto` 容器未正確啟用 touch 手勢；`focus` 觸發重新佈局後才暫時恢復。此為平台層行為，非資料或 SW 問題。

#### 嘗試過的方案

| 階段 | 作法 | 結果 |
|------|------|------|
| 早期緩解 | `kickScrollContainers()`：重設 `scrollTop`、`touchAction`、`-webkit-overflow-scrolling` | PWA-001 仍存在 |
| 方向 A（07-12） | 移除 `focusin` 的 `staggeredDocumentScrollReset` 與 `visualViewport` 的 `scrollTo(0,0)` | **PWA-002 修復**；PWA-001 仍存在 |
| 對照實驗 | 網址加 `?noRecover=1` 完全停用恢復碼 | PWA-001 **仍重現** → 排除恢復碼副作用 |

結論：先前改動是在「有問題的捲動層」上打補丁；減少 `scrollTo(0,0)` 可解 PWA-002，但無法解 PWA-001。

#### 最終解法：方向 D（document 自然捲動）

避開內層 overflow 捲動，改由整個頁面自然捲動：

1. **`public/index.html`**：移除 `html`／`body`／`#root` 的 `overflow: hidden`；刪除 inline 恢復腳本。
2. **`ScreenScroll.web.tsx`**：不再作為捲動容器；`scrollTo` 改呼叫 `window.scrollTo`。
3. **`screenScroll.ts`**：Web 端移除 `overflowY: auto` 等內層捲動樣式。
4. **`Screen.tsx`**：移除 `overflow: hidden`。
5. **刪除** `pwaScrollRecovery.ts`、`usePwaScrollRecovery.ts` 及相關測試。
6. **`App.tsx`**：路由切換時 `window.scrollTo(0, 0)` 回到頁首。
7. **`sw.js`**：`CACHE_NAME` → `v3`，確保實機載入新版。

#### 結案

- **PWA-001**：07-13 實機確認修復。
- **PWA-002**：方向 A 後實機確認修復；方向 D 部署後未復發。
- **離線資料**：斷網重開後 `localStorage`／IndexedDB 正常。

#### 備忘

- iOS 獨立 PWA 上，內層 `overflow: auto` 捲動在冷啟動時不可靠；優先使用 document 自然捲動。
- 鍵盤相關捲動問題，先檢查是否有 `scrollTo(0,0)` 或 `visualViewport` reset 與使用者操作衝突。
- 實機對照（如 `?noRecover=1`）有助區分「自家程式副作用」與「平台原生 bug」。

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
