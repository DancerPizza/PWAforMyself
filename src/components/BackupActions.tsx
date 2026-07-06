import { Pressable, StyleSheet, Text, View } from 'react-native';

import { monoFont, theme } from '../theme';
import { showValidationAlert } from '../utils/validation';

type BackupActionsProps = {
  onImported?: () => void;
};

export function BackupActions({ onImported: _onImported }: BackupActionsProps) {
  return (
    <View style={styles.bar}>
      <Pressable
        accessibilityRole="button"
        onPress={() => showValidationAlert('備份匯入僅支援 Web PWA。')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>匯出／匯入（Web）</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingVertical: 8,
    width: '100%'
  },
  button: {
    alignItems: 'center',
    borderColor: theme.border,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: 'center'
  },
  buttonText: {
    color: theme.mutedText,
    fontFamily: monoFont,
    fontSize: 12
  }
});
