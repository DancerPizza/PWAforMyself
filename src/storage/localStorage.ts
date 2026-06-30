type UpdateCollectionOptions<TItem> = {
  createItem?: () => TItem;
  matchItem: (item: TItem) => boolean;
  updateItem: (item: TItem) => TItem;
};

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readJson<TValue>(key: string, fallbackValue: TValue): TValue {
  if (!canUseLocalStorage()) {
    return fallbackValue;
  }

  const rawValue = window.localStorage.getItem(key);

  if (rawValue === null) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue) as TValue;
  } catch {
    return fallbackValue;
  }
}

export function writeJson<TValue>(key: string, value: TValue) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeJson(key: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(key);
}

export function readCollection<TItem>(key: string): TItem[] {
  return readJson<TItem[]>(key, []);
}

export function writeCollection<TItem>(key: string, items: TItem[]) {
  writeJson(key, items);
}

export function updateCollectionItem<TItem>(
  key: string,
  options: UpdateCollectionOptions<TItem>
) {
  const currentItems = readCollection<TItem>(key);
  let didUpdate = false;

  const nextItems = currentItems.map((item) => {
    if (!options.matchItem(item)) {
      return item;
    }

    didUpdate = true;
    return options.updateItem(item);
  });

  if (!didUpdate && options.createItem) {
    nextItems.push(options.createItem());
  }

  writeCollection(key, nextItems);
  return nextItems;
}

export function deleteCollectionItem<TItem>(
  key: string,
  matchItem: (item: TItem) => boolean
) {
  const nextItems = readCollection<TItem>(key).filter((item) => !matchItem(item));

  writeCollection(key, nextItems);
  return nextItems;
}
