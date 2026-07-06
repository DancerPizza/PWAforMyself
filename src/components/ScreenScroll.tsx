import { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native';

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
  const scrollRef = useRef<ScrollView>(null);

  useImperativeHandle(ref, () => ({
    scrollTo: (options) => {
      scrollRef.current?.scrollTo(options);
    }
  }));

  return (
    <ScrollView ref={scrollRef} style={[screenScrollStyle, style]} contentContainerStyle={contentContainerStyle}>
      {children}
    </ScrollView>
  );
});
