import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { readNoteImageBlob } from '../../storage/noteImages';
import { monoFont, theme } from '../../theme';

type NoteImageThumbProps = {
  imageId: string;
  size?: number;
  onRemove?: () => void;
};

export function NoteImageThumb({ imageId, size = 72, onRemove }: NoteImageThumbProps) {
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
    <View style={[styles.wrap, { height: size, width: size }]}>
      {uri ? (
        <Image accessibilityLabel="筆記圖片" source={{ uri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>圖</Text>
        </View>
      )}
      {onRemove ? (
        <Pressable
          accessibilityLabel="移除圖片"
          accessibilityRole="button"
          onPress={onRemove}
          style={({ pressed }) => [styles.removeButton, pressed && styles.removePressed]}
        >
          <Text style={styles.removeText}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderColor: theme.border,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    height: '100%',
    width: '100%'
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: theme.background,
    height: '100%',
    justifyContent: 'center',
    width: '100%'
  },
  placeholderText: {
    color: theme.mutedText,
    fontFamily: monoFont,
    fontSize: 12
  },
  removeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(35, 39, 46, 0.82)',
    borderRadius: 999,
    height: 22,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    top: 4,
    width: 22
  },
  removePressed: {
    opacity: 0.75
  },
  removeText: {
    color: theme.pink,
    fontFamily: monoFont,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16
  }
});
