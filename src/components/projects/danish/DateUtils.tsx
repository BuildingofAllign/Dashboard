
import { format, parseISO } from 'date-fns';
import { da } from 'date-fns/locale';

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = parseISO(dateString);
  return format(date, 'd. MMMM yyyy', { locale: da });
};

export const formatDateRange = (startDate?: string, endDate?: string): string => {
  if (!startDate && !endDate) return 'Ingen datoer';
  if (startDate && !endDate) return `Fra ${formatDate(startDate)}`;
  if (!startDate && endDate) return `Til ${formatDate(endDate)}`;
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export const formatCurrency = (amount: number | undefined): string => {
  if (!amount && amount !== 0) return 'Ikke angivet';
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    maximumFractionDigits: 0,
  }).format(amount);
};
