import { installMockLocalStorage } from '../../test/mockLocalStorage';
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
} from '../expenses';

describe('expenses storage', () => {
  const mockStorage = installMockLocalStorage();

  beforeEach(() => {
    mockStorage.clear();
  });

  it('creates income and expense records', () => {
    createExpense({
      type: 'income',
      amount: 50000,
      category: '',
      date: '2026-07-05',
      note: 'salary'
    });
    createExpense({
      type: 'expense',
      amount: 120,
      category: '飲食',
      date: '2026-07-06',
      note: 'lunch'
    });

    const items = readExpenses();
    expect(items).toHaveLength(2);
    expect(items[0].type).toBe('income');
    expect(items[1].category).toBe('飲食');
  });

  it('rejects non-positive amount', () => {
    const items = createExpense({
      type: 'expense',
      amount: 0,
      category: '飲食',
      date: '2026-07-06',
      note: ''
    });

    expect(items).toHaveLength(0);
  });

  it('updates and deletes expense', () => {
    const [created] = createExpense({
      type: 'expense',
      amount: 100,
      category: '交通',
      date: '2026-07-01',
      note: ''
    });

    updateExpense(created.id, {
      type: 'expense',
      amount: 200,
      category: '交通',
      date: '2026-07-02',
      note: 'taxi'
    });

    expect(readExpenses()[0].amount).toBe(200);

    deleteExpense(created.id);
    expect(readExpenses()).toHaveLength(0);
  });

  it('summarizes month and category totals', () => {
    createExpense({
      type: 'income',
      amount: 1000,
      category: '薪資',
      date: '2026-07-10',
      note: ''
    });
    createExpense({
      type: 'expense',
      amount: 300,
      category: '飲食',
      date: '2026-07-11',
      note: ''
    });
    createExpense({
      type: 'expense',
      amount: 200,
      category: '飲食',
      date: '2026-07-12',
      note: ''
    });

    const items = readExpenses();
    const summary = getMonthSummary(items, 2026, 6);

    expect(summary.income).toBe(1000);
    expect(summary.expense).toBe(500);
    expect(summary.balance).toBe(500);

    const categories = getCategoryTotals(items, 2026, 6, 'expense');
    expect(categories).toEqual([{ category: '飲食', amount: 500 }]);
  });

  it('lists months with expenses for a year', () => {
    createExpense({
      type: 'expense',
      amount: 50,
      category: '飲食',
      date: '2026-03-01',
      note: ''
    });
    createExpense({
      type: 'expense',
      amount: 80,
      category: '飲食',
      date: '2026-07-01',
      note: ''
    });

    expect(getMonthsWithExpenses(readExpenses(), 2026)).toEqual(new Set([2, 6]));
    expect(getExpensesByMonth(readExpenses(), 2026, 6)).toHaveLength(1);
  });

  it('formats amount for zh-TW locale', () => {
    expect(formatAmount(1234)).toMatch(/\$1,234/);
  });
});
