export const formatCurrency = (value: number, currency = 'USD', locale = 'es-MX') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(value);

