import { useEffect, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent
} from 'react-native';

import { readNoteImageBlob } from '../../storage/noteImages';
import { monoFont, textFont, theme } from '../../theme';

type NoteImageCarouselProps = {
  imageIds: string[];
};

function CarouselSlide({ imageId, width }: { imageId: string; width: number }) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    readNoteImageBlob(imageId)
      .then((blob) => {
        if (!active || !blob) {
          return;
        }

        objectUrl = URL.createObjectURL(blob);
        setUri(objectUrl);
      })
      .catch(() => {
        if (active) {
          setUri(null);
        }
      });

    return () => {
      active = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageId]);

  return (
    <View style={[styles.slide, { width }]}>
      {uri ? (
        <Image
          accessibilityLabel="筆記圖片"
          resizeMode="contain"
          source={{ uri }}
          style={styles.image}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>無法載入圖片</Text>
        </View>
      )}
    </View>
  );
}

export function NoteImageCarousel({ imageIds }: NoteImageCarouselProps) {
  const [pageWidth, setPageWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleLayout(event: LayoutChangeEvent) {
    setPageWidth(event.nativeEvent.layout.width);
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (pageWidth <= 0) {
      return;
    }

    const index = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setActiveIndex(index);
  }

  if (imageIds.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>此筆記沒有圖片</Text>
      </View>
    );
  }

  return (
    <View onLayout={handleLayout} style={styles.wrap}>
      {pageWidth > 0 ? (
        <>
          <ScrollView
            decelerationRate="fast"
            horizontal
            onScroll={handleScroll}
            pagingEnabled
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={styles.scroller}
          >
            {imageIds.map((imageId) => (
              <CarouselSlide key={imageId} imageId={imageId} width={pageWidth} />
            ))}
          </ScrollView>
          {imageIds.length > 1 ? (
            <View style={styles.indicatorRow}>
              {imageIds.map((imageId, index) => (
                <View
                  key={imageId}
                  style={[styles.indicatorDot, index === activeIndex && styles.indicatorDotActive]}
                />
              ))}
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: 0,
    width: '100%'
  },
  scroller: {
    flex: 1
  },
  slide: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center'
  },
  image: {
    height: '100%',
    width: '100%'
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: theme.background,
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    height: '80%',
    justifyContent: 'center',
    width: '90%'
  },
  placeholderText: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 14
  },
  emptyWrap: {
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 12,
    marginVertical: 8
  },
  emptyText: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 15
  },
  indicatorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingBottom: 8,
    paddingTop: 4
  },
  indicatorDot: {
    backgroundColor: theme.border,
    borderRadius: 999,
    height: 8,
    width: 8
  },
  indicatorDotActive: {
    backgroundColor: theme.cyan
  }
});
