import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Formats paise to human readable Indian Rupee string: e.g. 450000 -> ₹4,500 */
export function formatCurrencyPaise(paise: number): string {
  const rupees = Math.round(paise / 100);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}
