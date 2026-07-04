export const noteCategories = ['生活', '工作', '學習'] as const;

export type NoteCategory = (typeof noteCategories)[number];

export const noteFilterAll = '全部' as const;

export type NoteFilter = typeof noteFilterAll | NoteCategory;

export const noteFilterOptions: NoteFilter[] = [noteFilterAll, ...noteCategories];

export const defaultNoteCategory: NoteCategory = '生活';
