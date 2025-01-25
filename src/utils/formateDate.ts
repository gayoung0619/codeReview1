import dayjs from 'dayjs';

export const formatDate = (date: string | null): string | null => {
  return date ? dayjs(date).format("YYYY-MM-DD") : null;
};