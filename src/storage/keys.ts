export const storageKeys = {
  todos: 'expo-pwa-tools.todos',
  notes: 'expo-pwa-tools.notes',
  expenses: 'expo-pwa-tools.expenses'
} as const;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
