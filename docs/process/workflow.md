# Workflow

> `last_updated`: 2026-07-21

## 適用範圍

- 個人離線開發與維護流程。
- 部署：push `main` → GitHub Actions → Pages。
- 主線已結案；後續為維護或可選方向。
- 刪除／覆寫／重命名／不可逆 Git：先列影響清單，等待確認後再執行。

## 開工

1. 讀 `docs/README.md`、`Spec.md`、本檔、`Project_Log.md`。
2. 確認需求屬維護、可選方向或新功能。
3. `git status`；只改本次需要的檔案。

## 環境檢查

```bash
node --version
npm --version
npx expo --version
npx expo install --check
npm run typecheck
npm test
```

- 基準：Node 22 LTS、Expo 56（見 Spec）。
- 目標裝置變更時，更新 Spec §環境與裝置。

## Git

```bash
git status
git diff
git switch -c feature/short-task-name   # 可選
git add <file-path>
git commit -m "docs: update project workflow"
git log --oneline --decorate -5
```

## 開發

1. `npm run web`；以 DevTools 模擬 iPhone（不用 Expo Go）。
2. 先做最小可用版本；補型別、儲存與基本錯誤處理。
3. 桌面／手機尺寸手動測；PWA 用 HTTPS 正式站或 `npm run build:web`。
4. 更新 `Project_Log.md`；規格變更則更新 `Spec.md` 與 `docs/README.md`。

## 文件

| 檔案 | 用途 |
|------|------|
| `docs/product/Spec.md` | 範圍、技術、資料模型、驗收 |
| `docs/process/Project_Log.md` | `[yyyy-mm-dd]` 日誌 |
| `docs/README.md` | 對外導覽 |
| `docs/process/workflow.md` | 本檔 |

## 提交前

1. 無無關變更、無密鑰／敏感資料。
2. 文件與實作一致；未混入通知／SQLite／雲端同步。
3. 執行 typecheck／test（若適用）。

## 破壞性操作

1. 列完整影響清單與風險。
2. 等待「確認」或「ok」後再執行。
