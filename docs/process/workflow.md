# Workflow

> `last_updated`: 2026-07-05

## 適用範圍

- 本文件只記錄個人離線開發流程。
- 不包含部署、團隊審查、CI/CD、雲端同步或多人協作流程。
- 若流程涉及刪除、覆寫、重命名或不可逆 Git 操作，必須先列出影響清單並等待使用者確認。

## 每次開工流程

1. 依 `.cursorrules.md` §開工讀檔規則 讀取必要文件。
2. 確認本次需求是否屬於 MVP。
3. 使用 Git 確認工作區狀態。
4. 只針對本次任務需要的檔案進行修改。

## 新 Context Window 流程

- 同 §每次開工流程。

## 裝置資訊流程

- iPhone 型號、iOS 版本與主要瀏覽器建議提供一次。
- 當手機、iOS 版本或主要瀏覽器改變時，再更新 `docs/product/Spec.md`。
- 裝置資訊用於判斷 PWA 安裝、Safari 相容性、本地儲存、圖片、畫布與觸控行為。

## 開發工具檢查

```bash
node --version
npm --version
git --version
gh --version
npx expo --version
npx expo install --check
npm run typecheck
```

- 目前已確認 Node.js `v22.23.1` 與 npm `10.9.8`。
- 目前已確認 Git `2.51.0` 與 GitHub CLI 已安裝。
- 目前已確認 Expo CLI `56.1.18`，Expo SDK `56.0.14`。
- React、React DOM 與 React Native 版本需通過 `npx expo install --check`。
- 暫時性環境警告與 `npm audit` 紀錄見 `docs/process/Project_Log.md`。
- 若 Expo 相容性出問題，改用 Node.js LTS 22。

## Git 基本流程

### 查看狀態

```bash
git status
```

### 查看差異

```bash
git diff
```

### 建立功能分支

```bash
git switch -c feature/short-task-name
```

### 加入變更

```bash
git add <file-path>
```

### 提交變更

```bash
git commit -m "docs: update project workflow"
```

### 查看提交紀錄

```bash
git log --oneline --decorate -5
```

## Expo 開發流程

1. 建立 Expo TypeScript 專案。
2. 啟動開發伺服器：`npm run web`。
3. 使用瀏覽器開發者工具模擬 iPhone 尺寸與觸控。
4. Expo Go / Tunnel 因 App Store 無最新版，不再作為日常預覽方式。
5. 實機 PWA 安裝與離線測試留待 M6（iPhone Safari 加到主畫面）。

## 功能開發流程

1. 先確認需求是否屬於 MVP。
2. 若有多種實作方案，依 `.cursorrules.md` §操作確認規則 使用選項彈窗。
3. 先完成最小可用版本。
4. 補上必要的型別、資料儲存與基本錯誤處理。
5. 手動測試桌面瀏覽器與手機尺寸。
6. 更新 `docs/process/Project_Log.md` 實作紀錄。
7. 若階段任務狀態改變，同步更新 `docs/product/Spec.md` 與 `docs/agent/AGENTS.md`。

## 文件更新流程

1. `docs/product/Spec.md` 記錄產品方向、技術選型與階段性任務。
2. `docs/process/Project_Log.md` 以 `[yyyy-mm-dd]` 區塊記錄實作日誌，同類進度以 `[標籤]` 合併。
3. `docs/agent/AGENTS.md` 記錄 Agent 開發準則與目前進度。
4. `.cursorrules.md` 記錄專案固定規則與操作偏好。
5. `docs/process/workflow.md` 記錄可重複的個人開發流程。

## 提交前檢查

1. 確認沒有非本次任務需要的變更。
2. 確認沒有加入密鑰、帳號、token 或個人敏感資料。
3. 確認文件與實作方向一致。
4. 確認 PWA 方向未混入原生通知、SQLite 或雲端同步需求。
5. 執行可用的 lint、typecheck 或測試指令。

## 破壞性操作流程

1. 列出完整影響清單。
2. 說明操作動機與不可逆風險。
3. 等待使用者明確回覆「確認」或「ok」。
4. 收到確認後才執行。
