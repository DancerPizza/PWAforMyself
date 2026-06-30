export type ToolStatus = 'ready' | 'planned';

export type ToolEntry = {
  id: string;
  title: string;
  subtitle: string;
  status: ToolStatus;
  statusLabel: string;
};
