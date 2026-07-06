import { defaultNoteCategory } from '../../data/noteCategories';
import { installMockLocalStorage } from '../../test/mockLocalStorage';
import {
  createNote,
  deleteNote,
  getNotesSortedByDateDesc,
  readNotes,
  updateNote
} from '../notes';

describe('notes storage', () => {
  const mockStorage = installMockLocalStorage();

  beforeEach(() => {
    mockStorage.clear();
  });

  it('creates a note with default category and imageIds', () => {
    const items = createNote({
      title: 'Meeting',
      description: 'Notes here',
      date: '2026-07-10',
      category: '',
      imageIds: ['img-1']
    });

    expect(items).toHaveLength(1);
    expect(items[0].category).toBe(defaultNoteCategory);
    expect(items[0].imageIds).toEqual(['img-1']);
  });

  it('rejects empty title', () => {
    const items = createNote({
      title: '  ',
      description: '',
      date: '2026-07-10',
      category: '工作',
      imageIds: []
    });

    expect(items).toHaveLength(0);
  });

  it('updates note fields', () => {
    const [created] = createNote({
      title: 'Old',
      description: 'd',
      date: '2026-07-01',
      category: '生活',
      imageIds: []
    });

    updateNote(created.id, {
      title: 'New',
      description: 'updated',
      date: '2026-07-15',
      category: '學習',
      imageIds: ['a', 'b']
    });

    const note = readNotes()[0];
    expect(note.title).toBe('New');
    expect(note.description).toBe('updated');
    expect(note.imageIds).toEqual(['a', 'b']);
  });

  it('deletes a note', () => {
    const [created] = createNote({
      title: 'Delete',
      description: '',
      date: '2026-07-10',
      category: '生活',
      imageIds: []
    });

    expect(deleteNote(created.id)).toHaveLength(0);
  });

  it('sorts notes by date desc then updatedAt desc', () => {
    const items = [
      {
        id: '1',
        title: 'A',
        description: '',
        date: '2026-07-10',
        category: '生活',
        imageIds: [],
        createdAt: '2026-07-10T00:00:00.000Z',
        updatedAt: '2026-07-10T10:00:00.000Z'
      },
      {
        id: '2',
        title: 'B',
        description: '',
        date: '2026-07-10',
        category: '生活',
        imageIds: [],
        createdAt: '2026-07-10T00:00:00.000Z',
        updatedAt: '2026-07-10T12:00:00.000Z'
      },
      {
        id: '3',
        title: 'C',
        description: '',
        date: '2026-07-11',
        category: '生活',
        imageIds: [],
        createdAt: '2026-07-11T00:00:00.000Z',
        updatedAt: '2026-07-11T00:00:00.000Z'
      }
    ];

    const sorted = getNotesSortedByDateDesc(items);

    expect(sorted.map((item) => item.id)).toEqual(['3', '2', '1']);
  });
});
