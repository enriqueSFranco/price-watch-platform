export function formatDate(date: string | Date) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formatter = new Intl.DateTimeFormat('es-MX', options)
  return formatter.format(date)
}


export function formatMoney(value: number | string) {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    return '$0.00';
  }

  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "MXN",
    maximumSignificantDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay: "narrowSymbol",
    unitDisplay: "short"
  }

  const formatter = new Intl.NumberFormat('es-MX', options)
  return formatter.format(numericValue)
}
