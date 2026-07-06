import { Pressable, StyleSheet, Text, View } from 'react-native';

import { textFont, theme } from '../../theme';
import type { NoteItem } from '../../types/models';

type NoteDetailViewProps = {
  note: NoteItem;
  onBack: () => void;
};

export function NoteDetailView({ note, onBack }: NoteDetailViewProps) {
  return (
    <View style={styles.page}>
      <View style={styles.detailSection}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.meta}>{note.date}</Text>
        <Text style={styles.category}>{note.category}</Text>
        {note.description ? <Text style={styles.description}>{note.description}</Text> : null}
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>返回筆記</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 20
  },
  detailSection: {
    flex: 1,
    gap: 8
  },
  title: {
    color: theme.text,
    fontFamily: textFont,
    fontSize: 22,
    fontWeight: '600'
  },
  meta: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 13
  },
  category: {
    color: theme.purple,
    fontFamily: textFont,
    fontSize: 14,
    fontWeight: '600'
  },
  description: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 15,
    lineHeight: 24
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: theme.green,
    borderRadius: 14,
    marginTop: 12,
    minHeight: 44,
    justifyContent: 'center'
  },
  backButtonText: {
    color: theme.background,
    fontFamily: textFont,
    fontSize: 15,
    fontWeight: '700'
  }
});
