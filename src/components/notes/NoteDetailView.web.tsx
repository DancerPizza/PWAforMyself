import { Pressable, StyleSheet, Text, View } from 'react-native';

import { monoFont, textFont, theme } from '../../theme';
import type { NoteItem } from '../../types/models';
import { NoteImageCarousel } from './NoteImageCarousel';

type NoteDetailViewProps = {
  note: NoteItem;
  onBack: () => void;
};

export function NoteDetailView({ note, onBack }: NoteDetailViewProps) {
  return (
    <View style={styles.page}>
      <View style={styles.imageSection}>
        <NoteImageCarousel imageIds={note.imageIds} />
      </View>

      <View style={styles.detailSection}>
        <View style={styles.detailBody}>
          <Text style={styles.title}>{note.title}</Text>
          {note.description ? <Text style={styles.description}>{note.description}</Text> : null}
          <Text style={styles.meta}>{note.date}</Text>
          <Text style={styles.category}>{note.category}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.backPressed]}
        >
          <Text style={styles.backButtonText}>返回筆記</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: 0,
    width: '100%'
  },
  imageSection: {
    flex: 1,
    minHeight: 0,
    width: '100%'
  },
  detailSection: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    width: '100%'
  },
  detailBody: {
    flex: 1,
    gap: 10,
    minHeight: 0
  },
  title: {
    color: theme.text,
    fontFamily: textFont,
    fontSize: 22,
    fontWeight: '600'
  },
  description: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 15,
    lineHeight: 24
  },
  meta: {
    color: theme.mutedText,
    fontFamily: monoFont,
    fontSize: 13
  },
  category: {
    alignSelf: 'flex-start',
    backgroundColor: theme.background,
    borderColor: theme.purple,
    borderRadius: 999,
    borderWidth: 1,
    color: theme.purple,
    fontFamily: monoFont,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: theme.green,
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 44,
    width: '100%'
  },
  backPressed: {
    opacity: 0.75
  },
  backButtonText: {
    color: theme.background,
    fontFamily: textFont,
    fontSize: 15,
    fontWeight: '700'
  }
});
