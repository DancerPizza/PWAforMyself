import { installMockLocalStorage } from '../../test/mockLocalStorage';
import {
  createTodo,
  deleteTodo,
  getDatesWithTodos,
  getTodosByDate,
  getTodosByMonthNearToFar,
  readTodos,
  toggleTodoDone,
  updateTodoTitle
} from '../todos';

describe('todos storage', () => {
  const mockStorage = installMockLocalStorage();

  beforeEach(() => {
    mockStorage.clear();
  });

  it('creates a todo with trimmed title', () => {
    const items = createTodo('  Buy milk  ', '2026-07-10');

    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Buy milk');
    expect(items[0].date).toBe('2026-07-10');
    expect(items[0].done).toBe(false);
  });

  it('rejects empty title', () => {
    const items = createTodo('   ', '2026-07-10');

    expect(items).toHaveLength(0);
    expect(readTodos()).toHaveLength(0);
  });

  it('updates title and toggles done state', () => {
    const [created] = createTodo('Task A', '2026-07-10');

    updateTodoTitle(created.id, 'Task B');
    const afterToggle = toggleTodoDone(created.id);
    const updated = afterToggle.find((item) => item.id === created.id);

    expect(updated?.title).toBe('Task B');
    expect(updated?.done).toBe(true);
  });

  it('deletes a todo by id', () => {
    const [created] = createTodo('Remove me', '2026-07-10');

    const remaining = deleteTodo(created.id);

    expect(remaining).toHaveLength(0);
  });

  it('filters todos by date and collects marked dates', () => {
    createTodo('A', '2026-07-10');
    createTodo('B', '2026-07-11');
    const items = readTodos();

    expect(getTodosByDate(items, '2026-07-10')).toHaveLength(1);
    expect(getDatesWithTodos(items)).toEqual(new Set(['2026-07-10', '2026-07-11']));
  });

  it('sorts current month todos: upcoming before past, then by date', () => {
    const items = [
      {
        id: '1',
        title: 'Past',
        date: '2026-07-05',
        done: false,
        createdAt: '2026-07-05T00:00:00.000Z',
        updatedAt: '2026-07-05T00:00:00.000Z'
      },
      {
        id: '2',
        title: 'Future',
        date: '2026-07-20',
        done: false,
        createdAt: '2026-07-20T00:00:00.000Z',
        updatedAt: '2026-07-20T00:00:00.000Z'
      }
    ];

    const sorted = getTodosByMonthNearToFar(items, 2026, 6, '2026-07-10');

    expect(sorted.map((item) => item.id)).toEqual(['2', '1']);
  });
});
