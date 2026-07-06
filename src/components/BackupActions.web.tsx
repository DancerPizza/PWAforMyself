import { useRef, type ChangeEvent } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { downloadAppBackupFile, parseAppBackup, restoreAppBackup } from '../storage/backup';
import { monoFont, textFont, theme } from '../theme';
import { confirmAction, showValidationAlert } from '../utils/validation';

type BackupActionsProps = {
  onImported?: () => void;
};

export function BackupActions({ onImported }: BackupActionsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleExport() {
    downloadAppBackupFile();
    showValidationAlert('備份檔已下載。');
  }

  function handleImportPress() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const raw = typeof reader.result === 'string' ? reader.result : '';
      const backup = parseAppBackup(raw);

      if (!backup) {
        showValidationAlert('無法讀取備份檔，請確認 JSON 格式正確。');
        return;
      }

      const summary = `代辦 ${backup.data.todos.length} 筆、筆記 ${backup.data.notes.length} 筆、收支 ${backup.data.expenses.length} 筆`;

      if (!confirmAction(`匯入將覆蓋目前所有本地資料（${summary}）。確定要繼續嗎？`)) {
        return;
      }

      restoreAppBackup(backup);
      showValidationAlert('資料已還原，請重新開啟功能頁查看最新內容。');
      onImported?.();
    };

    reader.onerror = () => {
      showValidationAlert('讀取檔案失敗，請再試一次。');
    };

    reader.readAsText(file);
  }

  return (
    <View style={styles.bar}>
      <Pressable
        accessibilityRole="button"
        onPress={handleExport}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>匯出備份</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={handleImportPress}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>匯入還原</Text>
      </Pressable>
      <input
        ref={fileInputRef}
        accept="application/json,.json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        type="file"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    width: '100%'
  },
  button: {
    alignItems: 'center',
    borderColor: theme.border,
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    maxHeight: 48,
    minHeight: 40,
    paddingHorizontal: 12
  },
  buttonPressed: {
    opacity: 0.75
  },
  buttonText: {
    color: theme.mutedText,
    fontFamily: monoFont,
    fontSize: 12,
    fontWeight: '600'
  }
});
