import type { ToolEntry } from '../types/tool';

export const toolEntries: ToolEntry[] = [
  {
    id: 'todos',
    title: '極簡代辦事項',
    subtitle: '月曆檢視、日期標記與當日代辦列表。',
    status: 'planned',
    statusLabel: 'M3 開發'
  },
  {
    id: 'notes',
    title: '簡易筆記本',
    subtitle: '標題、描述、日期與分類的輕量筆記。',
    status: 'planned',
    statusLabel: 'M4 開發'
  },
  {
    id: 'expenses',
    title: '收支紀錄',
    subtitle: '年曆入口、月份列表與分類金額統計。',
    status: 'planned',
    statusLabel: 'M5 開發'
  }
];
