import type { SupportedCurrency, CurrencyCode } from '@/types';

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

const CURRENCY_MAP = new Map(SUPPORTED_CURRENCIES.map((c) => [c.code, c]));

export function getCurrencyMeta(code: CurrencyCode): SupportedCurrency {
  return CURRENCY_MAP.get(code) ?? { code, symbol: code, name: code };
}

export function fmt(amount: number, currency: CurrencyCode): string {
  const { symbol } = getCurrencyMeta(currency);
  const abs = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  return `${symbol}${abs}`;
}

export async function fetchLiveRates(
  baseCurrency: CurrencyCode
): Promise<Record<CurrencyCode, number>> {
  const res = await fetch(
    `https://open.er-api.com/v6/latest/${baseCurrency}`
  );
  if (!res.ok) throw new Error('Exchange rate fetch failed');
  const data = (await res.json()) as { rates: Record<string, number> };
  // API returns: 1 base = X foreign → invert to get base units per 1 foreign
  const inverted: Record<string, number> = { [baseCurrency]: 1 };
  for (const [code, rate] of Object.entries(data.rates)) {
    inverted[code] = 1 / rate;
  }
  return inverted;
}
