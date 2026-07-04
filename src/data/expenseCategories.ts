export const incomeCategories = ['薪資', '兼職', '其他'] as const;

export const expenseCategories = ['飲食', '交通', '居住', '娛樂', '其他'] as const;

export type IncomeCategory = (typeof incomeCategories)[number];

export type ExpenseCategory = (typeof expenseCategories)[number];

export const defaultIncomeCategory: IncomeCategory = '薪資';

export const defaultExpenseCategory: ExpenseCategory = '飲食';

export const monthShortLabels = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月'
] as const;
