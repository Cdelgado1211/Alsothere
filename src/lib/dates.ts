import { format, parseISO, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (value: string | Date, pattern = 'dd/MM/yyyy') => {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return format(date, pattern, { locale: es });
};

export const isPastDate = (value: string | Date) => {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return isBefore(date, new Date());
};

