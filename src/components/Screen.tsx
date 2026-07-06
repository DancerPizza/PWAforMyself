import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';

import { theme } from '../theme';

type ScreenProps = {
  children: ReactNode;
};

// Web PWA：以 env(safe-area-inset-*) 補齊 iPhone 滿版與底部 Home 指示條區域
const safeAreaStyle = {
  flex: 1,
  minHeight: 0,
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  backgroundColor: theme.background,
  paddingTop: 'env(safe-area-inset-top)',
  paddingBottom: 'env(safe-area-inset-bottom)',
  paddingLeft: 'env(safe-area-inset-left)',
  paddingRight: 'env(safe-area-inset-right)'
} as unknown as ViewStyle;

export function Screen({ children }: ScreenProps) {
  return <View style={safeAreaStyle}>{children}</View>;
}
