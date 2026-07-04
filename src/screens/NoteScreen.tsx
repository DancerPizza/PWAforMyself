import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import {
  defaultNoteCategory,
  noteCategories,
  noteFilterAll,
  noteFilterOptions,
  type NoteCategory,
  type NoteFilter
} from '../data/noteCategories';
import {
  createNote,
  deleteNote,
  getNotesSortedByDateDesc,
  readNotes,
  updateNote
} from '../storage/notes';
import { monoFont, textFont, theme } from '../theme';
import type { ISODateString, NoteItem } from '../types/models';
import { formatISODate } from '../utils/date';

type NoteScreenProps = {
  onBack: () => void;
};

type NoteFormState = {
  title: string;
  description: string;
  date: ISODateString;
  category: NoteCategory;
};

const emptyForm = (date: ISODateString): NoteFormState => ({
  title: '',
  description: '',
  date,
  category: defaultNoteCategory
});

export function NoteScreen({ onBack }: NoteScreenProps) {
  const today = formatISODate(new Date());
  const [notes, setNotes] = useState<NoteItem[]>(() => readNotes());
  const [form, setForm] = useState<NoteFormState>(() => emptyForm(today));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<NoteFilter>(noteFilterAll);

  const sortedNotes = useMemo(() => getNotesSortedByDateDesc(notes), [notes]);
  const filteredNotes = useMemo(() => {
    if (categoryFilter === noteFilterAll) {
      return sortedNotes;
    }

    return sortedNotes.filter((note) => note.category === categoryFilter);
  }, [categoryFilter, sortedNotes]);

  function resetForm() {
    setForm(emptyForm(today));
    setEditingId(null);
    setShowForm(false);
  }

  function handleStartCreate() {
    setEditingId(null);
    setForm(emptyForm(today));
    setShowForm(true);
  }

  function handleStartEdit(note: NoteItem) {
    setEditingId(note.id);
    setForm({
      title: note.title,
      description: note.description,
      date: note.date,
      category: noteCategories.includes(note.category as NoteCategory)
        ? (note.category as NoteCategory)
        : defaultNoteCategory
    });
    setShowForm(true);
  }

  function handleSaveNote() {
    if (!form.title.trim()) {
      return;
    }

    if (editingId) {
      setNotes(updateNote(editingId, form));
    } else {
      setNotes(createNote(form));
    }

    resetForm();
  }

  function handleDeleteNote(id: string) {
    setNotes(deleteNote(id));

    if (editingId === id) {
      resetForm();
    }
  }

  function updateFormField<Key extends keyof NoteFormState>(key: Key, value: NoteFormState[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.backButtonText}>← 返回</Text>
          </Pressable>
          <Text style={styles.screenTitle}>簡易筆記本</Text>
        </View>

        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>筆記列表</Text>

          <Text style={styles.fieldLabel}>分類篩選</Text>
          <View style={styles.categoryRow}>
            {noteFilterOptions.map((option) => {
              const isSelected = categoryFilter === option;

              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setCategoryFilter(option)}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected,
                    pressed && styles.buttonPressed
                  ]}
                >
                  <Text
                    style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.headerHint}>
            {filteredNotes.length > 0
              ? categoryFilter === noteFilterAll
                ? `共 ${filteredNotes.length} 則，依日期由新至舊`
                : `「${categoryFilter}」共 ${filteredNotes.length} 則`
              : categoryFilter === noteFilterAll
                ? '尚無筆記，可點下方按鈕新增'
                : `「${categoryFilter}」尚無筆記`}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleStartCreate}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.primaryButtonText}>新增筆記</Text>
          </Pressable>
        </View>

        {showForm ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{editingId ? '編輯筆記' : '新增筆記'}</Text>

            <Text style={styles.fieldLabel}>標題</Text>
            <TextInput
              accessibilityLabel="筆記標題"
              onChangeText={(value) => updateFormField('title', value)}
              placeholder="輸入標題"
              placeholderTextColor={theme.mutedText}
              style={styles.input}
              value={form.title}
            />

            <Text style={styles.fieldLabel}>描述</Text>
            <TextInput
              accessibilityLabel="筆記描述"
              multiline
              numberOfLines={4}
              onChangeText={(value) => updateFormField('description', value)}
              placeholder="輸入描述"
              placeholderTextColor={theme.mutedText}
              style={[styles.input, styles.textArea]}
              value={form.description}
            />

            <Text style={styles.fieldLabel}>日期（YYYY-MM-DD）</Text>
            <TextInput
              accessibilityLabel="筆記日期"
              onChangeText={(value) => updateFormField('date', value)}
              placeholder="2026-07-04"
              placeholderTextColor={theme.mutedText}
              style={styles.input}
              value={form.date}
            />

            <Text style={styles.fieldLabel}>分類</Text>
            <View style={styles.categoryRow}>
              {noteCategories.map((category) => {
                const isSelected = form.category === category;

                return (
                  <Pressable
                    key={category}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => updateFormField('category', category)}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                      pressed && styles.buttonPressed
                    ]}
                  >
                    <Text
                      style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.formActions}>
              <Pressable
                accessibilityRole="button"
                onPress={handleSaveNote}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.primaryButtonText}>{editingId ? '儲存' : '建立'}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={resetForm}
                style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.secondaryButtonText}>取消</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={styles.listCard}>
          {filteredNotes.map((note) => (
            <View key={note.id} style={styles.noteItem}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteCategory}>{note.category}</Text>
              </View>
              <Text style={styles.noteMeta}>{note.date}</Text>
              {note.description ? <Text style={styles.noteDescription}>{note.description}</Text> : null}
              <View style={styles.noteActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => handleStartEdit(note)}
                  style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.actionButtonText}>編輯</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => handleDeleteNote(note.id)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.deleteButton,
                    pressed && styles.buttonPressed
                  ]}
                >
                  <Text style={styles.deleteButtonText}>刪除</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24
  },
  topBar: {
    gap: 12,
    marginBottom: 20
  },
  backButton: {
    alignSelf: 'flex-start',
    borderColor: theme.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  backButtonText: {
    color: theme.cyan,
    fontFamily: textFont,
    fontSize: 14,
    fontWeight: '600'
  },
  screenTitle: {
    color: theme.text,
    fontFamily: textFont,
    fontSize: 28,
    fontWeight: '600'
  },
  headerCard: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: 24,
    borderWidth: 1,
    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.22)',
    marginBottom: 16,
    padding: 18
  },
  headerTitle: {
    color: theme.yellow,
    fontFamily: textFont,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12
  },
  headerHint: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 14,
    marginBottom: 16,
    marginTop: 4
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: theme.green,
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16
  },
  primaryButtonText: {
    color: theme.background,
    fontFamily: textFont,
    fontSize: 15,
    fontWeight: '700'
  },
  formCard: {
    backgroundColor: theme.surfaceElevated,
    borderColor: theme.border,
    borderRadius: 24,
    borderWidth: 1,
    boxShadow: '0 12px 26px rgba(0, 0, 0, 0.2)',
    marginBottom: 16,
    padding: 18
  },
  formTitle: {
    color: theme.text,
    fontFamily: textFont,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14
  },
  fieldLabel: {
    color: theme.cyan,
    fontFamily: textFont,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6
  },
  input: {
    backgroundColor: theme.background,
    borderColor: theme.border,
    borderRadius: 14,
    borderWidth: 1,
    color: theme.text,
    fontFamily: textFont,
    fontSize: 15,
    marginBottom: 12,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top'
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  categoryChip: {
    borderColor: theme.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  categoryChipSelected: {
    backgroundColor: theme.purple,
    borderColor: theme.purple
  },
  categoryChipText: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 14,
    fontWeight: '600'
  },
  categoryChipTextSelected: {
    color: theme.background
  },
  formActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: theme.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16
  },
  secondaryButtonText: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 15,
    fontWeight: '600'
  },
  listCard: {
    gap: 12
  },
  noteItem: {
    backgroundColor: theme.surfaceElevated,
    borderColor: theme.border,
    borderRadius: 20,
    borderWidth: 1,
    boxShadow: '0 12px 26px rgba(0, 0, 0, 0.2)',
    padding: 16
  },
  noteHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 6
  },
  noteTitle: {
    color: theme.text,
    flex: 1,
    fontFamily: textFont,
    fontSize: 18,
    fontWeight: '600'
  },
  noteCategory: {
    backgroundColor: theme.background,
    borderColor: theme.purple,
    borderRadius: 999,
    borderWidth: 1,
    color: theme.purple,
    fontFamily: monoFont,
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  noteMeta: {
    color: theme.mutedText,
    fontFamily: monoFont,
    fontSize: 12,
    marginBottom: 8
  },
  noteDescription: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8
  },
  actionButton: {
    borderColor: theme.border,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  actionButtonText: {
    color: theme.cyan,
    fontFamily: textFont,
    fontSize: 12,
    fontWeight: '600'
  },
  deleteButton: {
    borderColor: theme.pink
  },
  deleteButtonText: {
    color: theme.pink,
    fontFamily: textFont,
    fontSize: 12,
    fontWeight: '600'
  },
  buttonPressed: {
    opacity: 0.75
  }
});
