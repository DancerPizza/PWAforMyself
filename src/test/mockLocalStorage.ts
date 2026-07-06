// 測試用 localStorage 記憶體實作
export function installMockLocalStorage() {
  const store = new Map<string, string>();

  const mock = {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    get length() {
      return store.size;
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null
  };

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: mock
  });

  return {
    clear: () => store.clear()
  };
}
