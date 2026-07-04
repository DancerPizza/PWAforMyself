import type { ISODateString, TodoItem } from '../types/models';

import { getMonthRelation, isSameMonth } from '../utils/date';
import {
  deleteCollectionItem,
  readCollection,
  updateCollectionItem,
  writeCollection
} from './localStorage';
import { storageKeys } from './keys';

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function touchTimestamp() {
  return new Date().toISOString();
}

export function readTodos(): TodoItem[] {
  return readCollection<TodoItem>(storageKeys.todos);
}

export function writeTodos(items: TodoItem[]) {
  writeCollection(storageKeys.todos, items);
}

export function createTodo(title: string, date: ISODateString): TodoItem[] {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return readTodos();
  }

  const now = touchTimestamp();
  const nextItem: TodoItem = {
    id: createId(),
    title: trimmedTitle,
    date,
    done: false,
    createdAt: now,
    updatedAt: now
  };

  const nextItems = [...readTodos(), nextItem];

  writeTodos(nextItems);

  return nextItems;
}

export function updateTodoTitle(id: string, title: string): TodoItem[] {
  const trimmedTitle = title.trim();
  const now = touchTimestamp();

  if (!trimmedTitle) {
    return readTodos();
  }

  return updateCollectionItem<TodoItem>(storageKeys.todos, {
    matchItem: (item) => item.id === id,
    updateItem: (item) => ({
      ...item,
      title: trimmedTitle,
      updatedAt: now
    })
  });
}

export function toggleTodoDone(id: string): TodoItem[] {
  const now = touchTimestamp();

  return updateCollectionItem<TodoItem>(storageKeys.todos, {
    matchItem: (item) => item.id === id,
    updateItem: (item) => ({
      ...item,
      done: !item.done,
      updatedAt: now
    })
  });
}

export function deleteTodo(id: string): TodoItem[] {
  return deleteCollectionItem<TodoItem>(storageKeys.todos, (item) => item.id === id);
}

export function getTodosByDate(items: TodoItem[], date: ISODateString) {
  return items
    .filter((item) => item.date === date)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export function getDatesWithTodos(items: TodoItem[]) {
  return new Set(items.map((item) => item.date));
}

export function getTodosByMonthNearToFar(
  items: TodoItem[],
  year: number,
  monthIndex: number,
  today: ISODateString
) {
  const monthTodos = items.filter((item) => isSameMonth(item.date, year, monthIndex));
  const monthRelation = getMonthRelation(year, monthIndex, new Date(`${today}T00:00:00`));

  return monthTodos.sort((left, right) => {
    if (left.date !== right.date) {
      if (monthRelation === 'current') {
        const leftIsUpcoming = left.date >= today;
        const rightIsUpcoming = right.date >= today;

        if (leftIsUpcoming !== rightIsUpcoming) {
          return leftIsUpcoming ? -1 : 1;
        }
      }

      if (monthRelation === 'past') {
        return right.date.localeCompare(left.date);
      }

      return left.date.localeCompare(right.date);
    }

    return left.createdAt.localeCompare(right.createdAt);
  });
}
