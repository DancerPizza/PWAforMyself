# Expo PWA 極簡工具集

個人離線使用的 iPhone PWA 小工具集合，目標是保持功能簡單、資料本地儲存、安裝與預覽流程輕量。

## 功能概要

- 主畫面：三個功能入口按鈕。
- 極簡代辦事項：日期列表、事件日期標記、點選日期顯示當日代辦。
- 簡易筆記本：標題、描述、日期、分類。
- 收支紀錄：月份列表、收入支出紀錄、分類金額統計。
- 不做登入、雲端同步、自動提醒或推播通知。

## 文件

- [product/Spec.md](./product/Spec.md)：產品目的、技術棧、工具選用與階段性任務。
- [process/Project_Log.md](./process/Project_Log.md)：實作日誌。
- [process/workflow.md](./process/workflow.md)：個人離線開發流程與 Git 步驟。
- [agent/AGENTS.md](./agent/AGENTS.md)：Cursor Agent 開發準則與進度追蹤。

## 目前狀態

- M0 文件與規則整理完成。
- Markdown 文件已分類到 `docs/product/`、`docs/process/`、`docs/agent/`。
- Node.js `v24.18.0`、npm `11.16.0` 與 iPhone Expo Go 已準備好。
- 尚未建立 Expo TypeScript 專案骨架。
- 下一步是建立 Expo 專案、確認 Web / PWA 輸出設定，並完成主畫面三功能入口。

## 開發快速開始

```bash
npx create-expo-app@latest . --template blank-typescript
npx expo start
```

手機即時預覽使用 Expo Go；若同網段連線不穩，改用 Expo Tunnel。

## 技術棧

Expo、React、React Native Web、TypeScript、PWA、localStorage、IndexedDB。
