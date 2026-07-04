import type { ExpenseItem, ExpenseType, ISODateString } from '../types/models';

import {
  defaultExpenseCategory,
  defaultIncomeCategory
} from '../data/expenseCategories';
import { isSameMonth } from '../utils/date';
import {
  deleteCollectionItem,
  readCollection,
  updateCollectionItem,
  writeCollection
} from './localStorage';
import { storageKeys } from './keys';

export type ExpenseDraft = {
  type: ExpenseType;
  amount: number;
  category: string;
  date: ISODateString;
  note: string;
};

export type CategoryTotal = {
  category: string;
  amount: number;
};

export type MonthSummary = {
  income: number;
  expense: number;
  balance: number;
};

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `expense-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function touchTimestamp() {
  return new Date().toISOString();
}

function normalizeCategory(type: ExpenseType, category: string) {
  const trimmedCategory = category.trim();

  if (trimmedCategory) {
    return trimmedCategory;
  }

  return type === 'income' ? defaultIncomeCategory : defaultExpenseCategory;
}

export function readExpenses(): ExpenseItem[] {
  return readCollection<ExpenseItem>(storageKeys.expenses);
}

export function writeExpenses(items: ExpenseItem[]) {
  writeCollection(storageKeys.expenses, items);
}

export function createExpense(draft: ExpenseDraft): ExpenseItem[] {
  if (!Number.isFinite(draft.amount) || draft.amount <= 0) {
    return readExpenses();
  }

  const now = touchTimestamp();
  const nextItem: ExpenseItem = {
    id: createId(),
    type: draft.type,
    amount: draft.amount,
    category: normalizeCategory(draft.type, draft.category),
    date: draft.date,
    note: draft.note.trim(),
    createdAt: now,
    updatedAt: now
  };

  const nextItems = [...readExpenses(), nextItem];

  writeExpenses(nextItems);

  return nextItems;
}

export function updateExpense(id: string, draft: ExpenseDraft): ExpenseItem[] {
  if (!Number.isFinite(draft.amount) || draft.amount <= 0) {
    return readExpenses();
  }

  const now = touchTimestamp();

  return updateCollectionItem<ExpenseItem>(storageKeys.expenses, {
    matchItem: (item) => item.id === id,
    updateItem: (item) => ({
      ...item,
      type: draft.type,
      amount: draft.amount,
      category: normalizeCategory(draft.type, draft.category),
      date: draft.date,
      note: draft.note.trim(),
      updatedAt: now
    })
  });
}

export function deleteExpense(id: string): ExpenseItem[] {
  return deleteCollectionItem<ExpenseItem>(storageKeys.expenses, (item) => item.id === id);
}

export function getExpensesByMonth(items: ExpenseItem[], year: number, monthIndex: number) {
  return items
    .filter((item) => isSameMonth(item.date, year, monthIndex))
    .sort((left, right) => {
      const dateCompare = right.date.localeCompare(left.date);

      if (dateCompare !== 0) {
        return dateCompare;
      }

      return right.createdAt.localeCompare(left.createdAt);
    });
}

export function getMonthsWithExpenses(items: ExpenseItem[], year: number) {
  const monthSet = new Set<number>();

  items.forEach((item) => {
    const [itemYear, itemMonth] = item.date.split('-').map(Number);

    if (itemYear === year) {
      monthSet.add(itemMonth - 1);
    }
  });

  return monthSet;
}

export function getMonthSummary(items: ExpenseItem[], year: number, monthIndex: number): MonthSummary {
  const monthItems = getExpensesByMonth(items, year, monthIndex);

  const income = monthItems
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0);

  const expense = monthItems
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0);

  return {
    income,
    expense,
    balance: income - expense
  };
}

export function getCategoryTotals(
  items: ExpenseItem[],
  year: number,
  monthIndex: number,
  type: ExpenseType
): CategoryTotal[] {
  const totals = new Map<string, number>();

  getExpensesByMonth(items, year, monthIndex)
    .filter((item) => item.type === type)
    .forEach((item) => {
      totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
    });

  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((left, right) => right.amount - left.amount);
}

export function formatAmount(amount: number) {
  return `$${amount.toLocaleString('zh-TW', { maximumFractionDigits: 0 })}`;
}
