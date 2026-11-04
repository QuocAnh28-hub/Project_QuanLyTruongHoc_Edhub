import dayjs, { Dayjs } from 'dayjs';

export const formatDate = (
  time?: string | number | Date | Dayjs | null,
  format: string = 'DD/MM/YYYY',
  defaultString = '',
): string => {
  if (!time) return defaultString;
  return dayjs(time).format(format);
};

export const isValidDate = (date: any): boolean => {
  return dayjs(date).isValid();
};

export const toISOString = (date: Date | string | number): string => {
  return dayjs(date).toISOString();
};

export const startOfDay = (date: Date | string | number): Date => {
  return dayjs(date).startOf('day').toDate();
};

export const endOfDay = (date: Date | string | number): Date => {
  return dayjs(date).endOf('day').toDate();
};

export const getYear = (date: Date | string | number): number => {
  return dayjs(date).year();
};
