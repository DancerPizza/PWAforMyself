# Expo PWA 極簡工具集

個人離線使用的 iPhone PWA 小工具集合，目標是保持功能簡單、資料本地儲存、安裝與預覽流程輕量。

## 功能概要

- 主畫面：三個功能入口按鈕。
- 極簡代辦事項：月曆檢視、日期標記、當月代辦列表（由近至遠）、已過期未完成高亮。
- 簡易筆記本：列表檢視、分類篩選（生活／工作／學習）、CRUD。
- 收支紀錄：年曆入口、月份列表、收入／支出 CRUD、支出分類圓餅圖。
- 不做登入、雲端同步、自動提醒或推播通知。

## 文件

- [product/Spec.md](./product/Spec.md)：產品目的、技術棧、工具選用與階段性任務。
- [process/Project_Log.md](./process/Project_Log.md)：實作日誌。
- [process/workflow.md](./process/workflow.md)：個人離線開發流程與 Git 步驟。
- [agent/AGENTS.md](./agent/AGENTS.md)：Cursor Agent 開發準則與進度追蹤。

## 開發快速開始

```bash
npm install
npm run web
```

手機即時預覽可使用 Expo Go 或 Expo Tunnel；若 App Store 無法更新 Expo Go，改以瀏覽器開發工具模擬 iPhone 尺寸。

## 環境檢查

```bash
node --version
npm --version
npx expo --version
npx expo install --check
npm run typecheck
```

目前本機版本基準為 Node.js `v22.23.1`、npm `10.9.8`、Expo SDK `56.0.12`、Expo CLI `56.1.16`。

## 技術棧

Expo、React、React Native Web、TypeScript、PWA、localStorage、IndexedDB。

## UI 顏色與字樣

- `src/theme.ts` — `background`、`text`、`green`、`pink`、`cyan`、`yellow`、`purple`、`monoFont`、`textFont`
- `src/screens/HomeScreen.tsx` — 主畫面字樣
- `src/data/tools.ts` — 功能卡片字樣
- `src/screens/TodoScreen.tsx` — 代辦字樣；`overdueStyle`、`daySelected`、`dayToday`
- `src/screens/NoteScreen.tsx` — 筆記字樣；`categoryChipSelected`、`noteCategory`
- `src/data/noteCategories.ts` — 分類、`noteFilterOptions`
- `src/screens/ExpenseScreen.tsx` — 收支字樣；`incomeText`、`expenseText`、`cardHint`
- `src/data/expenseCategories.ts` — 收支分類選項
- `src/components/ExpensePieChart.tsx` — `segmentColors`
- `docs/agent/AGENTS.md`、`docs/product/Spec.md` — 產品規格文字（非 UI）
