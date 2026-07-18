import { useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { Screen } from '../components/Screen';
import { ScreenScroll } from '../components/ScreenScroll';
import { useScrollToSection } from '../hooks/useScrollToSection';
import {
  createTodo,
  deleteTodo,
  getDatesWithTodos,
  getTodosByMonthNearToFar,
  readTodos,
  toggleTodoDone,
  updateTodoTitle
} from '../storage/todos';
import { monoFont, textFont, theme } from '../theme';
import type { ISODateString, TodoItem } from '../types/models';
import {
  buildCalendarGrid,
  formatISODate,
  getDefaultDateForMonth,
  getMonthLabel,
  parseISODate
} from '../utils/date';
import { getFirstMissingField, confirmAction, showValidationAlert } from '../utils/validation';

const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六'];

// 自訂：已過期且未完成的代辦高亮底色（可改此處）
const overdueStyle = {
  backgroundColor: '#4a3038',
  borderColor: theme.pink
};

function isOverdueTodo(todo: TodoItem, today: ISODateString) {
  return !todo.done && todo.date < today;
}

type TodoScreenProps = {
  onBack: () => void;
};

export function TodoScreen({ onBack }: TodoScreenProps) {
  const today = formatISODate(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();

    return {
      year: now.getFullYear(),
      monthIndex: now.getMonth()
    };
  });
  const [selectedDate, setSelectedDate] = useState<ISODateString>(today);
  const [todos, setTodos] = useState<TodoItem[]>(() => readTodos());
  const [draftTitle, setDraftTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const draftInputRef = useRef<TextInput>(null);
  const { scrollRef, onSectionLayout, scrollToSection } = useScrollToSection();

  const datesWithTodos = useMemo(() => getDatesWithTodos(todos), [todos]);
  const calendarCells = useMemo(
    () => buildCalendarGrid(visibleMonth.year, visibleMonth.monthIndex),
    [visibleMonth.monthIndex, visibleMonth.year]
  );
  const monthTodos = useMemo(
    () => getTodosByMonthNearToFar(todos, visibleMonth.year, visibleMonth.monthIndex, today),
    [todos, visibleMonth.monthIndex, visibleMonth.year, today]
  );

  function shiftMonth(step: -1 | 1) {
    setVisibleMonth((current) => {
      const nextDate = new Date(current.year, current.monthIndex + step, 1);
      const year = nextDate.getFullYear();
      const monthIndex = nextDate.getMonth();

      setSelectedDate(getDefaultDateForMonth(year, monthIndex, today));
      setEditingId(null);
      setEditingTitle('');

      return { year, monthIndex };
    });
  }

  function handleSelectDate(date: ISODateString) {
    setSelectedDate(date);
    setEditingId(null);
    setEditingTitle('');
  }

  function handleCreateTodo() {
    const missingField = getFirstMissingField([{ label: '待辦內容', value: draftTitle }]);

    if (missingField) {
      showValidationAlert(`請輸入${missingField}！`);
      scrollToSection();
      draftInputRef.current?.focus();
      return;
    }

    const nextTodos = createTodo(draftTitle, selectedDate);

    setTodos(nextTodos);
    setDraftTitle('');
  }

  function handleToggleTodo(id: string) {
    setTodos(toggleTodoDone(id));
  }

  function handleStartEdit(todo: TodoItem) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  function handleSaveEdit() {
    if (!editingId) {
      return;
    }

    const missingField = getFirstMissingField([{ label: '待辦內容', value: editingTitle }]);

    if (missingField) {
      showValidationAlert(`請輸入${missingField}！`);
      return;
    }

    setTodos(updateTodoTitle(editingId, editingTitle));
    setEditingId(null);
    setEditingTitle('');
  }

  function handleDeleteTodo(id: string) {
    if (!confirmAction('確定要刪除待辦嗎？')) {
      return;
    }

    setTodos(deleteTodo(id));

    if (editingId === id) {
      setEditingId(null);
      setEditingTitle('');
    }
  }

  return (
    <Screen>
      <ScreenScroll ref={scrollRef} contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.backButtonText}>← 返回</Text>
          </Pressable>
          <Text style={styles.screenTitle}>待辦事項</Text>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <Pressable
              accessibilityRole="button"
              onPress={() => shiftMonth(-1)}
              style={({ pressed }) => [styles.monthButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.monthButtonText}>‹</Text>
            </Pressable>
            <Text style={styles.monthLabel}>
              {getMonthLabel(visibleMonth.year, visibleMonth.monthIndex)}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => shiftMonth(1)}
              style={({ pressed }) => [styles.monthButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.monthButtonText}>›</Text>
            </Pressable>
          </View>

          <View style={styles.weekdayRow}>
            {weekdayLabels.map((label) => (
              <Text key={label} style={styles.weekdayLabel}>
                {label}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarCells.map((cell, index) => {
              if (!cell.date || cell.day === null) {
                return <View key={`empty-${index}`} style={styles.dayCell} />;
              }

              const isSelected = cell.date === selectedDate;
              const isToday = cell.date === today;
              const hasTodos = datesWithTodos.has(cell.date);

              return (
                <Pressable
                  key={cell.date}
                  accessibilityRole="button"
                  onPress={() => handleSelectDate(cell.date as ISODateString)}
                  style={({ pressed }) => [
                    styles.dayCell,
                    styles.dayButton,
                    isSelected && styles.daySelected,
                    isToday && !isSelected && styles.dayToday,
                    pressed && styles.buttonPressed
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      isToday && !isSelected && styles.dayTextToday
                    ]}
                  >
                    {cell.day}
                  </Text>
                  {hasTodos ? <View style={styles.todoMarker} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.listTitle}>
            {getMonthLabel(visibleMonth.year, visibleMonth.monthIndex)}代辦
          </Text>
          <Text style={styles.listHint}>
            {monthTodos.length > 0
              ? `共 ${monthTodos.length} 項，由近至遠排序`
              : '此月份尚無代辦，選取日期後可在下方新增'}
          </Text>
          <Text style={styles.selectedDateHint}>
            新增目標日期：{formatSelectedDateLabel(selectedDate)}
          </Text>

          <View onLayout={onSectionLayout} style={styles.addRow}>
            <TextInput
              ref={draftInputRef}
              accessibilityLabel="新增待辦標題"
              onChangeText={setDraftTitle}
              onSubmitEditing={handleCreateTodo}
              placeholder="輸入待辦內容"
              placeholderTextColor={theme.mutedText}
              returnKeyType="done"
              style={styles.input}
              value={draftTitle}
            />
            <Pressable
              accessibilityRole="button"
              onPress={handleCreateTodo}
              style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.addButtonText}>新增</Text>
            </Pressable>
          </View>

          <View style={styles.todoList}>
            {monthTodos.map((todo, index) => {
              const isEditing = editingId === todo.id;
              const previousDate = index > 0 ? monthTodos[index - 1].date : null;
              const showDateHeader = todo.date !== previousDate;
              const isOverdue = isOverdueTodo(todo, today);

              return (
                <View key={todo.id}>
                  {showDateHeader ? (
                    <Text style={styles.dateHeader}>{formatSelectedDateLabel(todo.date)}</Text>
                  ) : null}
                  <View style={[styles.todoItem, isOverdue && styles.todoItemOverdue]}>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: todo.done }}
                    onPress={() => handleToggleTodo(todo.id)}
                    style={({ pressed }) => [
                      styles.checkButton,
                      todo.done && styles.checkButtonDone,
                      pressed && styles.buttonPressed
                    ]}
                  >
                    <Text style={styles.checkButtonText}>{todo.done ? '✓' : ''}</Text>
                  </Pressable>

                  <View style={styles.todoContent}>
                    {isEditing ? (
                      <TextInput
                        accessibilityLabel="編輯待辦標題"
                        autoFocus
                        onChangeText={setEditingTitle}
                        onSubmitEditing={handleSaveEdit}
                        style={styles.input}
                        value={editingTitle}
                      />
                    ) : (
                      <Text style={[styles.todoTitle, todo.done && styles.todoTitleDone]}>
                        {todo.title}
                      </Text>
                    )}
                  </View>

                  <View style={styles.todoActions}>
                    {isEditing ? (
                      <Pressable
                        accessibilityRole="button"
                        onPress={handleSaveEdit}
                        style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
                      >
                        <Text style={styles.actionButtonText}>儲存</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => handleStartEdit(todo)}
                        style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
                      >
                        <Text style={styles.actionButtonText}>編輯</Text>
                      </Pressable>
                    )}
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handleDeleteTodo(todo.id)}
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
                </View>
              );
            })}
          </View>
        </View>
      </ScreenScroll>
    </Screen>
  );
}

function formatSelectedDateLabel(dateValue: ISODateString) {
  const date = parseISODate(dateValue);
  const weekday = weekdayLabels[date.getDay()];

  return `${dateValue}（${weekday}）`;
}

const styles = StyleSheet.create({
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
  calendarCard: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: 24,
    borderWidth: 1,
    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.22)',
    marginBottom: 20,
    padding: 18
  },
  monthHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  monthButton: {
    alignItems: 'center',
    borderColor: theme.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  monthButtonText: {
    color: theme.yellow,
    fontFamily: monoFont,
    fontSize: 24,
    lineHeight: 24
  },
  monthLabel: {
    color: theme.text,
    fontFamily: textFont,
    fontSize: 18,
    fontWeight: '600'
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  weekdayLabel: {
    color: theme.mutedText,
    flex: 1,
    fontFamily: monoFont,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  dayCell: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginBottom: 6,
    width: `${100 / 7}%`
  },
  dayButton: {
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1
  },
  daySelected: {
    backgroundColor: theme.green,
    borderColor: theme.green
  },
  dayToday: {
    borderColor: theme.cyan
  },
  dayText: {
    color: theme.text,
    fontFamily: monoFont,
    fontSize: 14,
    fontWeight: '600'
  },
  dayTextSelected: {
    color: theme.background
  },
  dayTextToday: {
    color: theme.cyan
  },
  todoMarker: {
    backgroundColor: theme.pink,
    borderRadius: 999,
    height: 6,
    marginTop: 4,
    width: 6
  },
  listCard: {
    backgroundColor: theme.surfaceElevated,
    borderColor: theme.border,
    borderRadius: 24,
    borderWidth: 1,
    boxShadow: '0 12px 26px rgba(0, 0, 0, 0.2)',
    padding: 18
  },
  listTitle: {
    color: theme.yellow,
    fontFamily: textFont,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6
  },
  listHint: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 14,
    marginBottom: 8
  },
  selectedDateHint: {
    color: theme.cyan,
    fontFamily: textFont,
    fontSize: 13,
    marginBottom: 16
  },
  dateHeader: {
    color: theme.purple,
    fontFamily: monoFont,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4
  },
  addRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  input: {
    backgroundColor: theme.background,
    borderColor: theme.border,
    borderRadius: 14,
    borderWidth: 1,
    color: theme.text,
    flex: 1,
    fontFamily: textFont,
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: theme.green,
    borderRadius: 14,
    justifyContent: 'center',
    minWidth: 72,
    paddingHorizontal: 16
  },
  addButtonText: {
    color: theme.background,
    fontFamily: textFont,
    fontSize: 15,
    fontWeight: '700'
  },
  todoList: {
    gap: 10
  },
  todoItem: {
    alignItems: 'center',
    backgroundColor: theme.background,
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12
  },
  todoItemOverdue: {
    backgroundColor: overdueStyle.backgroundColor,
    borderColor: overdueStyle.borderColor
  },
  checkButton: {
    alignItems: 'center',
    borderColor: theme.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28
  },
  checkButtonDone: {
    backgroundColor: theme.green,
    borderColor: theme.green
  },
  checkButtonText: {
    color: theme.background,
    fontFamily: monoFont,
    fontSize: 14,
    fontWeight: '700'
  },
  todoContent: {
    flex: 1
  },
  todoTitle: {
    color: theme.text,
    fontFamily: textFont,
    fontSize: 15,
    lineHeight: 22
  },
  todoTitleDone: {
    color: theme.mutedText,
    textDecorationLine: 'line-through'
  },
  todoActions: {
    flexDirection: 'row',
    gap: 6
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
