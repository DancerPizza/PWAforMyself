import {
  forwardRef,
  useImperativeHandle,
  type CSSProperties,
  type ReactNode
} from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { screenScrollStyle } from '../styles/screenScroll';

export type ScreenScrollRef = {
  scrollTo: (options: { y: number; animated?: boolean }) => void;
};

type ScreenScrollProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const ScreenScroll = forwardRef<ScreenScrollRef, ScreenScrollProps>(function ScreenScroll(
  { children, style, contentContainerStyle },
  ref
) {
  useImperativeHandle(ref, () => ({
    scrollTo: ({ y, animated = true }) => {
      window.scrollTo({
        top: y,
        behavior: animated ? 'smooth' : 'auto'
      });
    }
  }));

  const mergedStyle = StyleSheet.flatten([screenScrollStyle, style]) as CSSProperties;

  return (
    <div style={mergedStyle}>
      <View style={contentContainerStyle}>{children}</View>
    </div>
  );
});
