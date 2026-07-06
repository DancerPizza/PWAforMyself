import { readCollection, writeCollection } from './localStorage';
import { storageKeys } from './keys';
import type { ExpenseItem, NoteItem, TodoItem } from '../types/models';

export const BACKUP_VERSION = 1;

export type AppBackup = {
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  data: {
    todos: TodoItem[];
    notes: NoteItem[];
    expenses: ExpenseItem[];
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isItemArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function createAppBackup(): AppBackup {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      todos: readCollection<TodoItem>(storageKeys.todos),
      notes: readCollection<NoteItem>(storageKeys.notes),
      expenses: readCollection<ExpenseItem>(storageKeys.expenses)
    }
  };
}

export function isValidAppBackup(value: unknown): value is AppBackup {
  if (!isRecord(value) || value.version !== BACKUP_VERSION || typeof value.exportedAt !== 'string') {
    return false;
  }

  if (!isRecord(value.data)) {
    return false;
  }

  return (
    isItemArray<TodoItem>(value.data.todos) &&
    isItemArray<NoteItem>(value.data.notes) &&
    isItemArray<ExpenseItem>(value.data.expenses)
  );
}

export function parseAppBackup(raw: string): AppBackup | null {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isValidAppBackup(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function restoreAppBackup(backup: AppBackup) {
  writeCollection(storageKeys.todos, backup.data.todos);
  writeCollection(storageKeys.notes, backup.data.notes);
  writeCollection(storageKeys.expenses, backup.data.expenses);
}

export function downloadAppBackupFile() {
  if (typeof document === 'undefined') {
    return;
  }

  const backup = createAppBackup();
  const stamp = backup.exportedAt.slice(0, 10);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `pwa-tools-backup-${stamp}.json`;
  anchor.click();

  URL.revokeObjectURL(url);
}
