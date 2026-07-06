import { Alert, Platform } from 'react-native';

import type { ISODateString } from '../types/models';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type FieldCheck = {
  label: string;
  value: string;
};

export function isValidISODateString(value: string): value is ISODateString {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  );
}

export function showValidationAlert(message: string) {
  // React Native Alert 在 web 無實作，改用瀏覽器原生對話框
  if (Platform.OS === 'web') {
    window.alert(message);
    return;
  }

  Alert.alert('提醒', message);
}

export function confirmAction(message: string) {
  if (Platform.OS === 'web') {
    return window.confirm(message);
  }

  return false;
}

export function getFirstMissingField(fields: FieldCheck[]) {
  return fields.find((field) => !field.value.trim())?.label ?? null;
}

export function getDateValidationMessage(value: string) {
  if (!value.trim()) {
    return '請輸入日期！';
  }

  if (!isValidISODateString(value.trim())) {
    return '請輸入有效的日期！';
  }

  return null;
}

export function normalizeISODateString(value: string): ISODateString {
  return value.trim() as ISODateString;
}
