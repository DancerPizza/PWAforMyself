import { Platform, type ViewStyle } from 'react-native';

// Web 使用 document 自然捲動，避免 iOS 獨立 PWA 冷啟動時內層 overflow 容器失效
export const screenScrollStyle: ViewStyle = Platform.select({
  web: {
    flexGrow: 1,
    width: '100%'
  },
  default: {
    flex: 1,
    minHeight: 0
  }
}) as ViewStyle;
