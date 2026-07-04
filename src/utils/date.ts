import type { ISODateString } from '../types/models';

export function formatISODate(date: Date): ISODateString {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseISODate(value: ISODateString): Date {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day);
}

export function isSameMonth(dateValue: ISODateString, year: number, monthIndex: number) {
  const date = parseISODate(dateValue);

  return date.getFullYear() === year && date.getMonth() === monthIndex;
}

export type MonthRelation = 'past' | 'current' | 'future';

export function getMonthRelation(
  year: number,
  monthIndex: number,
  referenceDate: Date = new Date()
): MonthRelation {
  const referenceYear = referenceDate.getFullYear();
  const referenceMonthIndex = referenceDate.getMonth();

  if (year > referenceYear) {
    return 'future';
  }

  if (year < referenceYear) {
    return 'past';
  }

  if (monthIndex > referenceMonthIndex) {
    return 'future';
  }

  if (monthIndex < referenceMonthIndex) {
    return 'past';
  }

  return 'current';
}

export function getDefaultDateForMonth(year: number, monthIndex: number, today: ISODateString) {
  if (isSameMonth(today, year, monthIndex)) {
    return today;
  }

  return formatISODate(new Date(year, monthIndex, 1));
}

export function getMonthLabel(year: number, monthIndex: number) {
  return `${year} 年 ${monthIndex + 1} 月`;
}

export type CalendarCell = {
  date: ISODateString | null;
  day: number | null;
};

export function buildCalendarGrid(year: number, monthIndex: number): CalendarCell[] {
  const firstDay = new Date(year, monthIndex, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let index = 0; index < startWeekday; index += 1) {
    cells.push({ date: null, day: null });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, monthIndex, day);

    cells.push({
      date: formatISODate(date),
      day
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, day: null });
  }

  return cells;
}
