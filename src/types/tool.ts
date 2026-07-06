export type ToolId = 'todos' | 'notes' | 'expenses';

export type ToolStatus = 'ready' | 'planned';

export type ToolEntry = {
  id: ToolId;
  title: string;
  status: ToolStatus;
};
