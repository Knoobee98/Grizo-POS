export function formatCurrency(amount: number, symbol: string = 'Rp'): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const cleanSymbol = symbol.trim();
  if (!cleanSymbol || cleanSymbol === 'Rp' || cleanSymbol === 'IDR' || cleanSymbol.toLowerCase() === 'rp') {
    const formatted = Math.round(absAmount).toLocaleString('id-ID');
    return `${isNegative ? '-' : ''}Rp ${formatted}`;
  }

  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${isNegative ? '-' : ''}${cleanSymbol}${formatted}`;
}
