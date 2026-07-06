import { Platform, type ViewStyle } from 'react-native';

// Screen 內 ScrollView 需 flex:1，否則 iOS PWA 從背景恢復後可能無法滑動
export const screenScrollStyle: ViewStyle = Platform.select({
  web: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    touchAction: 'pan-y'
  },
  default: {
    flex: 1,
    minHeight: 0
  }
}) as ViewStyle;
