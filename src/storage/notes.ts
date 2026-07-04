import type { ISODateString, NoteItem } from '../types/models';

import { defaultNoteCategory } from '../data/noteCategories';
import {
  deleteCollectionItem,
  readCollection,
  updateCollectionItem,
  writeCollection
} from './localStorage';
import { storageKeys } from './keys';

export type NoteDraft = {
  title: string;
  description: string;
  date: ISODateString;
  category: string;
};

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function touchTimestamp() {
  return new Date().toISOString();
}

export function readNotes(): NoteItem[] {
  return readCollection<NoteItem>(storageKeys.notes);
}

export function writeNotes(items: NoteItem[]) {
  writeCollection(storageKeys.notes, items);
}

export function createNote(draft: NoteDraft): NoteItem[] {
  const trimmedTitle = draft.title.trim();
  const trimmedCategory = draft.category.trim();

  if (!trimmedTitle) {
    return readNotes();
  }

  const now = touchTimestamp();
  const nextItem: NoteItem = {
    id: createId(),
    title: trimmedTitle,
    description: draft.description.trim(),
    date: draft.date,
    category: trimmedCategory || defaultNoteCategory,
    imageIds: [],
    createdAt: now,
    updatedAt: now
  };

  const nextItems = [...readNotes(), nextItem];

  writeNotes(nextItems);

  return nextItems;
}

export function updateNote(id: string, draft: NoteDraft): NoteItem[] {
  const trimmedTitle = draft.title.trim();
  const trimmedCategory = draft.category.trim();
  const now = touchTimestamp();

  if (!trimmedTitle) {
    return readNotes();
  }

  return updateCollectionItem<NoteItem>(storageKeys.notes, {
    matchItem: (item) => item.id === id,
    updateItem: (item) => ({
      ...item,
      title: trimmedTitle,
      description: draft.description.trim(),
      date: draft.date,
      category: trimmedCategory || defaultNoteCategory,
      updatedAt: now
    })
  });
}

export function deleteNote(id: string): NoteItem[] {
  return deleteCollectionItem<NoteItem>(storageKeys.notes, (item) => item.id === id);
}

export function getNotesSortedByDateDesc(items: NoteItem[]) {
  return [...items].sort((left, right) => {
    const dateCompare = right.date.localeCompare(left.date);

    if (dateCompare !== 0) {
      return dateCompare;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}
