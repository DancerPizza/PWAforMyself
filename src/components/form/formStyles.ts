import { StyleSheet } from 'react-native';

import { monoFont, textFont, theme } from '../../theme';

export const formStyles = StyleSheet.create({
  fieldLabel: {
    color: theme.cyan,
    fontFamily: textFont,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6
  },
  fieldHint: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
    marginTop: -2
  },
  input: {
    backgroundColor: theme.background,
    borderColor: theme.border,
    borderRadius: 14,
    borderWidth: 1,
    color: theme.text,
    fontFamily: textFont,
    fontSize: 16,
    marginBottom: 12,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top'
  },
  monoHint: {
    color: theme.mutedText,
    fontFamily: monoFont,
    fontSize: 11
  }
});
