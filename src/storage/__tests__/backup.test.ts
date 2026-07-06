import { installMockLocalStorage } from '../../test/mockLocalStorage';
import type { ExpenseItem, NoteItem, TodoItem } from '../../types/models';
import {
  BACKUP_VERSION,
  createAppBackup,
  isValidAppBackup,
  parseAppBackup,
  restoreAppBackup,
  type AppBackup
} from '../backup';
import { storageKeys } from '../keys';
import { readJson } from '../localStorage';

describe('backup', () => {
  const mockStorage = installMockLocalStorage();

  const sampleTodo: TodoItem = {
    id: 't1',
    title: 'Todo',
    date: '2026-07-10',
    done: false,
    createdAt: '2026-07-10T00:00:00.000Z',
    updatedAt: '2026-07-10T00:00:00.000Z'
  };

  const sampleNote: NoteItem = {
    id: 'n1',
    title: 'Note',
    description: 'desc',
    date: '2026-07-10',
    category: '生活',
    imageIds: ['img-1'],
    createdAt: '2026-07-10T00:00:00.000Z',
    updatedAt: '2026-07-10T00:00:00.000Z'
  };

  const sampleExpense: ExpenseItem = {
    id: 'e1',
    type: 'expense',
    amount: 99,
    category: '飲食',
    date: '2026-07-10',
    note: '',
    createdAt: '2026-07-10T00:00:00.000Z',
    updatedAt: '2026-07-10T00:00:00.000Z'
  };

  beforeEach(() => {
    mockStorage.clear();
  });

  it('exports current collections with version and imageIds', () => {
    window.localStorage.setItem(storageKeys.todos, JSON.stringify([sampleTodo]));
    window.localStorage.setItem(storageKeys.notes, JSON.stringify([sampleNote]));
    window.localStorage.setItem(storageKeys.expenses, JSON.stringify([sampleExpense]));

    const backup = createAppBackup();

    expect(backup.version).toBe(BACKUP_VERSION);
    expect(backup.data.todos).toEqual([sampleTodo]);
    expect(backup.data.notes[0].imageIds).toEqual(['img-1']);
    expect(typeof backup.exportedAt).toBe('string');
  });

  it('parses valid backup and rejects invalid payload', () => {
    const valid = {
      version: BACKUP_VERSION,
      exportedAt: '2026-07-07T00:00:00.000Z',
      data: {
        todos: [sampleTodo],
        notes: [sampleNote],
        expenses: [sampleExpense]
      }
    };

    expect(isValidAppBackup(valid)).toBe(true);
    expect(parseAppBackup(JSON.stringify(valid))).toEqual(valid);
    expect(parseAppBackup('{bad json')).toBeNull();
    expect(parseAppBackup(JSON.stringify({ version: 999 }))).toBeNull();
  });

  it('restores all collections from backup', () => {
    const backup: AppBackup = {
      version: BACKUP_VERSION,
      exportedAt: '2026-07-07T00:00:00.000Z',
      data: {
        todos: [sampleTodo],
        notes: [sampleNote],
        expenses: [sampleExpense]
      }
    };

    restoreAppBackup(backup);

    expect(readJson(storageKeys.todos, [])).toEqual([sampleTodo]);
    expect(readJson(storageKeys.notes, [])).toEqual([sampleNote]);
    expect(readJson(storageKeys.expenses, [])).toEqual([sampleExpense]);
  });
});
