# Spec

> `last_updated`: 2026-07-21

## 目的

- 可安裝到 iPhone 主畫面的極簡個人 PWA 工具集。
- 優先離線本機使用；不做登入、雲端同步、自動提醒或原生通知。

## 功能範圍（已完成）

- 主畫面：三入口（僅標題）+ JSON 匯出／匯入。
- 代辦：月曆、日期標記、當日列表、CRUD、過期高亮。
- 筆記：列表、標題／描述／日期／分類、篩選；圖片最多 3 張（IndexedDB）、查看模式。
- 收支：年曆、月份列表、收入／支出 CRUD、支出分類圓餅圖。
- 儲存：代辦／筆記／收支 → `localStorage`；筆記圖片 blob → IndexedDB。

## 非範圍

- 登入、雲端同步、推播／原生通知、iOS Widget。
- 行事曆提醒（月曆／年曆僅作瀏覽 UI）。
- 拍照、畫筆；備份**不含**圖片 blob（可列後續優化）。

## 技術棧

| 類別 | 選用 |
|------|------|
| 框架 | Expo（Web） |
| UI | React / React Native Web |
| 語言 | TypeScript |
| PWA | Manifest + Service Worker（Cache-First 靜態資源） |
| 儲存 | localStorage；圖片用 IndexedDB |
| 預覽 | `npm run web` + 瀏覽器 DevTools |

## 環境與裝置

- Node.js 22 LTS、Expo SDK 56、React 19、React Native 0.85
- 目標：iPhone、Safari 獨立 PWA
- 正式站：https://dancerpizza.github.io/PWAforMyself/

## 原則

- 先 MVP；優先改現有檔案，避免冗餘抽象與大型套件。
- 程式放 `src/`；文件放 `docs/product/`、`docs/process/`。

## 資料模型

### TodoItem

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | string | 唯一識別 |
| `title` | string | 標題 |
| `date` | string | `YYYY-MM-DD` |
| `done` | boolean | 是否完成 |
| `createdAt` / `updatedAt` | string | 時間戳 |

### NoteItem

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | string | 唯一識別 |
| `title` / `description` | string | 標題／內容 |
| `date` | string | 筆記日期 |
| `category` | string | 分類 |
| `imageIds` | string[] | IndexedDB 圖片參照（最多 3） |
| `createdAt` / `updatedAt` | string | 時間戳 |

### ExpenseItem

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | string | 唯一識別 |
| `type` | `"income" \| "expense"` | 收入／支出 |
| `amount` | number | 金額 |
| `category` | string | 分類 |
| `date` | string | `YYYY-MM-DD` |
| `note` | string | 備註 |
| `createdAt` / `updatedAt` | string | 時間戳 |

## 驗收（已通過）

- SW：Cache-First 靜態資源；不做 Background Sync／Push。
- 離線：斷網後仍可開啟已安裝 PWA 並讀寫 `localStorage`（2026-07-07）。
- 筆記圖片：選圖、縮圖、查看模式；備份僅含 `imageIds`。
- JSON 備份：匯出／匯入，覆蓋前確認。
- PWA-001／PWA-002／PWA-LAYOUT 均已結案（見 Project_Log）。
