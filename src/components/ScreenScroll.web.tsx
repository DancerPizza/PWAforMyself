import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactNode
} from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { screenScrollStyle } from '../styles/screenScroll';
import { kickScrollContainers } from '../utils/pwaScrollRecovery';

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollTo: ({ y, animated = true }) => {
      scrollRef.current?.scrollTo({
        top: y,
        behavior: animated ? 'smooth' : 'auto'
      });
    }
  }));

  useEffect(() => {
    kickScrollContainers();
  }, []);

  const mergedStyle = StyleSheet.flatten([screenScrollStyle, style]) as CSSProperties;

  return (
    <div ref={scrollRef} data-pwa-scroll="true" style={mergedStyle}>
      <View style={contentContainerStyle}>{children}</View>
    </div>
  );
});
