# Expo PWA 極簡工具集

個人離線用的 iPhone PWA（代辦、筆記、收支）。**專案已結案**。

正式網址：https://dancerpizza.github.io/PWAforMyself/

## 功能

- 主畫面：三功能入口 + JSON 匯出／匯入
- 代辦：月曆、日期標記、CRUD、過期高亮
- 筆記：列表、分類、圖片（最多 3 張，IndexedDB）、查看模式
- 收支：年曆、月份列表、CRUD、支出圓餅圖
- 不做：登入、雲端同步、推播提醒

## 文件

- [product/Spec.md](./product/Spec.md)：範圍、技術棧、資料模型、驗收
- [process/Project_Log.md](./process/Project_Log.md)：實作日誌
- [process/workflow.md](./process/workflow.md)：開發與 Git 流程

## 開發

```bash
npm install
npm run web          # 本機預覽
npm run build:web    # 產出 dist/
npm run typecheck
npm test
```

## 部署

- `experiments.baseUrl`：`/PWAforMyself`
- push `main` → GitHub Actions 部署 Pages
- 離線／安裝請用 HTTPS 正式網址（區網 `http://` 可能無法註冊 SW）

本機預覽正式版：`npm run build:web` 後 `npx serve dist`

## 環境基準

- Node.js 22 LTS、Expo SDK 56、React 19、React Native 0.85
- 目標裝置：iPhone + Safari（獨立 PWA）

## 模組索引

| 路徑 | 用途 |
|------|------|
| `App.tsx` | 路由、`storageVersion` |
| `src/screens/` | 主畫面／代辦／筆記／收支 |
| `src/storage/` | localStorage、備份、筆記圖片 IndexedDB |
| `src/components/form/` | 共用表單 |
| `src/components/notes/` | 選圖、縮圖、輪播、詳情 |
| `public/manifest.json`、`public/sw.js` | PWA 安裝與離線 |

## 已知問題

目前無開放項目。結案紀錄見 [Project_Log](./process/Project_Log.md)。
