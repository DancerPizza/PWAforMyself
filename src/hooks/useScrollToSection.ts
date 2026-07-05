import { useCallback, useRef } from 'react';
import type { LayoutChangeEvent, ScrollView } from 'react-native';

export function useScrollToSection() {
  const scrollRef = useRef<ScrollView>(null);
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
