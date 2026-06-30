export type ISODateString = string;
export type ISODateTimeString = string;

export type TodoItem = {
  id: string;
  title: string;
  date: ISODateString;
  done: boolean;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};

export type NoteItem = {
  id: string;
  title: string;
  description: string;
  date: ISODateString;
  category: string;
  imageIds: string[];
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};

export type ExpenseType = 'income' | 'expense';

export type ExpenseItem = {
  id: string;
  type: ExpenseType;
  amount: number;
  category: string;
  date: ISODateString;
  note: string;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
