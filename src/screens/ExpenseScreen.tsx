import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { Screen } from '../components/Screen';
import { useScrollToSection } from '../hooks/useScrollToSection';
import {
  defaultExpenseCategory,
  defaultIncomeCategory,
  expenseCategories,
  incomeCategories,
  monthShortLabels,
  type ExpenseCategory,
  type IncomeCategory
} from '../data/expenseCategories';
import { ExpensePieChart } from '../components/ExpensePieChart';
import {
  createExpense,
  deleteExpense,
  formatAmount,
  getCategoryTotals,
  getExpensesByMonth,
  getMonthSummary,
  getMonthsWithExpenses,
  readExpenses,
  updateExpense
} from '../storage/expenses';
import { monoFont, textFont, theme } from '../theme';
import type { ExpenseItem, ExpenseType, ISODateString } from '../types/models';
import { formatISODate, getDefaultDateForMonth, getMonthLabel } from '../utils/date';
import {
  getDateValidationMessage,
  getFirstMissingField,
  normalizeISODateString,
  showValidationAlert
} from '../utils/validation';

type ExpenseScreenProps = {
  onBack: () => void;
};

type ExpenseView = 'year' | 'month';

type ExpenseFormState = {
  type: ExpenseType;
  amount: string;
  category: string;
  date: ISODateString;
  note: string;
};

function emptyForm(year: number, monthIndex: number, today: ISODateString): ExpenseFormState {
  return {
    type: 'expense',
    amount: '',
    category: defaultExpenseCategory,
    date: getDefaultDateForMonth(year, monthIndex, today),
    note: ''
  };
}

function getCategoriesForType(type: ExpenseType) {
  return type === 'income' ? incomeCategories : expenseCategories;
}

function normalizeFormCategory(type: ExpenseType, category: string) {
  const categories = getCategoriesForType(type);

  if (categories.includes(category as IncomeCategory & ExpenseCategory)) {
    return category;
  }

  return type === 'income' ? defaultIncomeCategory : defaultExpenseCategory;
}

export function ExpenseScreen({ onBack }: ExpenseScreenProps) {
  const today = formatISODate(new Date());
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => readExpenses());
  const [view, setView] = useState<ExpenseView>('year');
  const [visibleYear, setVisibleYear] = useState(currentYear);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExpenseFormState>(() =>
    emptyForm(currentYear, currentMonthIndex, today)
  );
  const amountInputRef = useRef<TextInput>(null);
  const { scrollRef, onSectionLayout, scrollToSection } = useScrollToSection();

  const monthsWithExpenses = useMemo(
    () => getMonthsWithExpenses(expenses, visibleYear),
    [expenses, visibleYear]
  );
  const monthExpenses = useMemo(
    () => getExpensesByMonth(expenses, visibleYear, selectedMonthIndex),
    [expenses, selectedMonthIndex, visibleYear]
  );
  const monthSummary = useMemo(
    () => getMonthSummary(expenses, visibleYear, selectedMonthIndex),
    [expenses, selectedMonthIndex, visibleYear]
  );
  const expenseCategoryTotals = useMemo(
    () => getCategoryTotals(expenses, visibleYear, selectedMonthIndex, 'expense'),
    [expenses, selectedMonthIndex, visibleYear]
  );

  useEffect(() => {
    if (!showForm) {
      return;
    }

    const timer = setTimeout(() => {
      scrollToSection();
      amountInputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [showForm, scrollToSection]);

  function openMonth(monthIndex: number) {
    setSelectedMonthIndex(monthIndex);
    setForm(emptyForm(visibleYear, monthIndex, today));
    setEditingId(null);
    setShowForm(false);
    setView('month');
  }

  function backToYear() {
    setView('year');
    setEditingId(null);
    setShowForm(false);
  }

  function resetForm() {
    setForm(emptyForm(visibleYear, selectedMonthIndex, today));
    setEditingId(null);
    setShowForm(false);
  }

  function handleStartCreate() {
    setEditingId(null);
    setForm(emptyForm(visibleYear, selectedMonthIndex, today));
    setShowForm(true);
  }

  function handleStartEdit(item: ExpenseItem) {
    setEditingId(item.id);
    setForm({
      type: item.type,
      amount: String(item.amount),
      category: normalizeFormCategory(item.type, item.category),
      date: item.date,
      note: item.note
    });
    setShowForm(true);
  }

  function handleSaveExpense() {
    const missingField = getFirstMissingField([{ label: '金額', value: form.amount }]);

    if (missingField) {
      showValidationAlert(`請輸入${missingField}！`);
      scrollToSection();
      return;
    }

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      showValidationAlert('請輸入有效的金額！');
      scrollToSection();
      return;
    }

    const dateMessage = getDateValidationMessage(form.date);

    if (dateMessage) {
      showValidationAlert(dateMessage);
      scrollToSection();
      return;
    }

    const draft = {
      type: form.type,
      amount,
      category: form.category,
      date: normalizeISODateString(form.date),
      note: form.note
    };

    if (editingId) {
      setExpenses(updateExpense(editingId, draft));
    } else {
      setExpenses(createExpense(draft));
    }

    resetForm();
  }

  function handleDeleteExpense(id: string) {
    setExpenses(deleteExpense(id));

    if (editingId === id) {
      resetForm();
    }
  }

  function updateFormField<Key extends keyof ExpenseFormState>(key: Key, value: ExpenseFormState[Key]) {
    setForm((current) => {
      const next = {
        ...current,
        [key]: value
      };

      if (key === 'type') {
        const nextType = value as ExpenseType;

        next.category =
          nextType === 'income' ? defaultIncomeCategory : defaultExpenseCategory;
      }

      return next;
    });
  }

  return (
    <Screen>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            onPress={view === 'year' ? onBack : backToYear}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.backButtonText}>{view === 'year' ? '← 返回' : '← 年曆'}</Text>
          </Pressable>
          <Text style={styles.screenTitle}>收支紀錄</Text>
        </View>

        {view === 'year' ? (
          <View style={styles.card}>
            <View style={styles.yearHeader}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setVisibleYear((year) => year - 1)}
                style={({ pressed }) => [styles.navButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.navButtonText}>‹</Text>
              </Pressable>
              <Text style={styles.yearLabel}>{visibleYear} 年</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setVisibleYear((year) => year + 1)}
                style={({ pressed }) => [styles.navButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.navButtonText}>›</Text>
              </Pressable>
            </View>
            <Text style={styles.cardHint}>選擇月份進入收支列表</Text>
            <View style={styles.yearGrid}>
              {monthShortLabels.map((label, monthIndex) => {
                const hasRecords = monthsWithExpenses.has(monthIndex);
                const isCurrentMonth =
                  visibleYear === currentYear && monthIndex === currentMonthIndex;

                return (
                  <Pressable
                    key={label}
                    accessibilityRole="button"
                    onPress={() => openMonth(monthIndex)}
                    style={({ pressed }) => [
                      styles.monthTile,
                      isCurrentMonth && styles.monthTileCurrent,
                      pressed && styles.buttonPressed
                    ]}
                  >
                    <Text style={[styles.monthTileText, isCurrentMonth && styles.monthTileTextCurrent]}>
                      {label}
                    </Text>
                    {hasRecords ? <View style={styles.monthMarker} /> : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{getMonthLabel(visibleYear, selectedMonthIndex)}</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>收入</Text>
                  <Text style={[styles.summaryValue, styles.incomeText]}>
                    {formatAmount(monthSummary.income)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>支出</Text>
                  <Text style={[styles.summaryValue, styles.expenseText]}>
                    {formatAmount(monthSummary.expense)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>結餘</Text>
                  <Text style={styles.summaryValue}>{formatAmount(monthSummary.balance)}</Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={handleStartCreate}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.primaryButtonText}>新增紀錄</Text>
              </Pressable>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>支出分類統計</Text>
              <Text style={styles.cardHint}>
                {expenseCategoryTotals.length > 0
                  ? '圓餅比例 = 該分類花費 ÷ 當月總花費 × 100%'
                  : '此月份尚無支出紀錄'}
              </Text>
              <ExpensePieChart totals={expenseCategoryTotals} />
            </View>

            {showForm ? (
              <View onLayout={onSectionLayout} style={styles.formCard}>
                <Text style={styles.formTitle}>{editingId ? '編輯紀錄' : '新增紀錄'}</Text>

                <Text style={styles.fieldLabel}>類型</Text>
                <View style={styles.typeRow}>
                  {(['expense', 'income'] as ExpenseType[]).map((type) => {
                    const isSelected = form.type === type;
                    const label = type === 'income' ? '收入' : '支出';

                    return (
                      <Pressable
                        key={type}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        onPress={() => updateFormField('type', type)}
                        style={({ pressed }) => [
                          styles.typeChip,
                          type === 'income' ? styles.incomeChip : styles.expenseChip,
                          isSelected && styles.typeChipSelected,
                          pressed && styles.buttonPressed
                        ]}
                      >
                        <Text style={[styles.typeChipText, isSelected && styles.typeChipTextSelected]}>
                          {label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>備註</Text>
                <TextInput
                  accessibilityLabel="備註"
                  multiline
                  numberOfLines={3}
                  onChangeText={(value) => updateFormField('note', value)}
                  placeholder="選填"
                  placeholderTextColor={theme.mutedText}
                  style={[styles.input, styles.textArea]}
                  value={form.note}
                />

                <Text style={styles.fieldLabel}>金額</Text>
                <TextInput
                  ref={amountInputRef}
                  accessibilityLabel="金額"
                  keyboardType="numeric"
                  onChangeText={(value) => updateFormField('amount', value)}
                  placeholder="輸入金額"
                  placeholderTextColor={theme.mutedText}
                  style={styles.input}
                  value={form.amount}
                />

                <Text style={styles.fieldLabel}>分類</Text>
                <View style={styles.categoryRow}>
                  {getCategoriesForType(form.type).map((category) => {
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
                          style={[
                            styles.categoryChipText,
                            isSelected && styles.categoryChipTextSelected
                          ]}
                        >
                          {category}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>日期（YYYY-MM-DD）</Text>
                <TextInput
                  accessibilityLabel="日期"
                  onChangeText={(value) => updateFormField('date', value)}
                  placeholder="2026-07-04"
                  placeholderTextColor={theme.mutedText}
                  style={styles.input}
                  value={form.date}
                />

                <View style={styles.formActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={handleSaveExpense}
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
              <Text style={styles.cardTitle}>月份列表</Text>
              <Text style={styles.cardHint}>
                {monthExpenses.length > 0
                  ? `共 ${monthExpenses.length} 筆，依日期由新至舊`
                  : '此月份尚無紀錄'}
              </Text>
              {monthExpenses.map((item) => (
                <View key={item.id} style={styles.recordItem}>
                  <View style={styles.recordHeader}>
                    <Text
                      style={[
                        styles.recordType,
                        item.type === 'income' ? styles.incomeText : styles.expenseText
                      ]}
                    >
                      {item.type === 'income' ? '收入' : '支出'}
                    </Text>
                    <Text style={styles.recordAmount}>{formatAmount(item.amount)}</Text>
                  </View>
                  <Text style={styles.recordMeta}>
                    {item.date} · {item.category}
                  </Text>
                  {item.note ? <Text style={styles.recordNote}>{item.note}</Text> : null}
                  <View style={styles.recordActions}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handleStartEdit(item)}
                      style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
                    >
                      <Text style={styles.actionButtonText}>編輯</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handleDeleteExpense(item.id)}
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
          </>
        )}
      </ScrollView>
    </Screen>
  );
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
  card: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: 24,
    borderWidth: 1,
    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.22)',
    marginBottom: 16,
    padding: 18
  },
  cardTitle: {
    color: theme.yellow,
    fontFamily: textFont,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8
  },
  cardHint: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 14,
    marginBottom: 14
  },
  yearHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  navButton: {
    alignItems: 'center',
    borderColor: theme.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  navButtonText: {
    color: theme.yellow,
    fontFamily: monoFont,
    fontSize: 24,
    lineHeight: 24
  },
  yearLabel: {
    color: theme.text,
    fontFamily: textFont,
    fontSize: 22,
    fontWeight: '600'
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  monthTile: {
    alignItems: 'center',
    backgroundColor: theme.surfaceElevated,
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 72,
    justifyContent: 'center',
    width: '30%'
  },
  monthTileCurrent: {
    borderColor: theme.cyan
  },
  monthTileText: {
    color: theme.text,
    fontFamily: textFont,
    fontSize: 16,
    fontWeight: '600'
  },
  monthTileTextCurrent: {
    color: theme.cyan
  },
  monthMarker: {
    backgroundColor: theme.pink,
    borderRadius: 999,
    height: 6,
    marginTop: 8,
    width: 6
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  summaryItem: {
    backgroundColor: theme.surfaceElevated,
    borderColor: theme.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    padding: 12
  },
  summaryLabel: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 12,
    marginBottom: 6
  },
  summaryValue: {
    color: theme.text,
    fontFamily: monoFont,
    fontSize: 14,
    fontWeight: '700'
  },
  incomeText: {
    color: theme.green
  },
  expenseText: {
    color: theme.pink
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
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  typeChip: {
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  incomeChip: {
    borderColor: theme.green
  },
  expenseChip: {
    borderColor: theme.pink
  },
  typeChipSelected: {
    backgroundColor: theme.background
  },
  typeChipText: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  typeChipTextSelected: {
    color: theme.text
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
    minHeight: 88,
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
    gap: 12,
    marginBottom: 8
  },
  recordItem: {
    backgroundColor: theme.surfaceElevated,
    borderColor: theme.border,
    borderRadius: 20,
    borderWidth: 1,
    boxShadow: '0 12px 26px rgba(0, 0, 0, 0.2)',
    padding: 16
  },
  recordHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  recordType: {
    fontFamily: textFont,
    fontSize: 14,
    fontWeight: '700'
  },
  recordAmount: {
    color: theme.text,
    fontFamily: monoFont,
    fontSize: 16,
    fontWeight: '700'
  },
  recordMeta: {
    color: theme.mutedText,
    fontFamily: monoFont,
    fontSize: 12,
    marginBottom: 6
  },
  recordNote: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10
  },
  recordActions: {
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
