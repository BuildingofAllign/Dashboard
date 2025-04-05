
import { format as formatFns } from "date-fns";
import { da } from "date-fns/locale";

/**
 * Format a date using date-fns
 */
export function formatDate(date: Date | string, formatStr: string = "d. MMM yyyy"): string {
  if (!date) return "Ingen dato";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return "Ugyldig dato";
  }
  
  return formatFns(dateObj, formatStr, { locale: da });
}

/**
 * Format a date range
 */
export function formatDateRange(startDate?: Date | string, endDate?: Date | string): string {
  if (!startDate && !endDate) return "Ingen datoer";
  if (startDate && !endDate) return `Fra ${formatDate(startDate)}`;
  if (!startDate && endDate) return `Til ${formatDate(endDate)}`;
  
  return `${formatDate(startDate as Date | string)} - ${formatDate(endDate as Date | string)}`;
}

/**
 * Get relative time (e.g. "2 days ago")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Lige nu";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutter siden`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} timer siden`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} dage siden`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} måneder siden`;
  
  return `${Math.floor(diffInSeconds / 31536000)} år siden`;
}

/**
 * Format currency in Danish format
 */
export function formatCurrency(amount: number | undefined): string {
  if (!amount && amount !== 0) return 'Ikke angivet';
  
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    maximumFractionDigits: 0,
  }).format(amount);
}
