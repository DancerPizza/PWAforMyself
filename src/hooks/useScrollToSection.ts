import { useCallback, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';

import type { ScreenScrollRef } from '../components/ScreenScroll';

export function useScrollToSection() {
  const scrollRef = useRef<ScreenScrollRef>(null);
  const sectionOffsetRef = useRef(0);

  const onSectionLayout = useCallback((event: LayoutChangeEvent) => {
    sectionOffsetRef.current = event.nativeEvent.layout.y;
  }, []);

  const scrollToSection = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(sectionOffsetRef.current - 12, 0),
        animated: true
      });
    });
  }, []);

  return {
    scrollRef,
    onSectionLayout,
    scrollToSection
  };
}
