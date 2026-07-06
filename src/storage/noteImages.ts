const DB_NAME = 'expo-pwa-tools';
const DB_VERSION = 1;
const STORE_NAME = 'note-images';

type ImageRecord = {
  id: string;
  blob: Blob;
  mimeType: string;
  createdAt: string;
};

function canUseIndexedDB() {
  return typeof indexedDB !== 'undefined';
}

function createImageId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `img-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function openImageDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!canUseIndexedDB()) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });
}

function runWrite<T>(operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openImageDatabase().then(
    (database) =>
      new Promise<T>((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        const request = operation(transaction.objectStore(STORE_NAME));

        transaction.oncomplete = () => {
          database.close();
          resolve(request.result as T);
        };

        transaction.onerror = () => {
          database.close();
          reject(transaction.error ?? new Error('IndexedDB write failed'));
        };
      })
  );
}

function runRead<T>(operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openImageDatabase().then(
    (database) =>
      new Promise<T>((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readonly');
        const request = operation(transaction.objectStore(STORE_NAME));

        request.onsuccess = () => {
          database.close();
          resolve(request.result as T);
        };

        request.onerror = () => {
          database.close();
          reject(request.error ?? new Error('IndexedDB read failed'));
        };
      })
  );
}

export async function saveNoteImage(file: Blob, mimeType: string) {
  const id = createImageId();
  const record: ImageRecord = {
    id,
    blob: file,
    mimeType: mimeType || 'image/jpeg',
    createdAt: new Date().toISOString()
  };

  await runWrite((store) => store.put(record));
  return id;
}

export async function readNoteImageBlob(id: string) {
  const record = await runRead<ImageRecord | undefined>((store) => store.get(id));
  return record?.blob ?? null;
}

export async function deleteNoteImage(id: string) {
  await runWrite((store) => store.delete(id));
}

export async function deleteNoteImages(ids: string[]) {
  if (ids.length === 0) {
    return;
  }

  const database = await openImageDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    for (const id of ids) {
      store.delete(id);
    }

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };

    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error('IndexedDB delete failed'));
    };
  });
}
