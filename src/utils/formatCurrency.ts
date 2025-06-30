export function formatCurrency(amount: number, currency: string = '$'): string {
  if (isNaN(amount)) return '';
  return `${currency}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
} 