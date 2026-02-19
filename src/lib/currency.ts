export const formatCurrency = (value: number, currency = 'USD', locale = 'es-MX') => {
  if (currency === 'MXN') {
    const numeric = new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    return `$${numeric} MXN`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(value);
};

