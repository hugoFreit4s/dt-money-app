export function formatCurrencyFromCents(valueInCents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInCents / 100);
}

export function parseCurrencyToCents(value: string): number {
  const digits = value.replace(/\D/g, '');
  return Number(digits) || 0;
}

export function formatCurrencyInput(valueInCents: number): string {
  return formatCurrencyFromCents(valueInCents);
}
