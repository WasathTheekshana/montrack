'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage, KEYS } from '../storage/adapter';
import { fetchLiveRates } from '../currency';
import type { ExchangeRateCache, CurrencyCode } from '@/types';

const TTL_MS = 60 * 60 * 1000; // 1 hour

export function useCurrency(baseCurrency: CurrencyCode) {
  const [rates, setRates] = useState<Record<string, number>>({ [baseCurrency]: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (force = false) => {
      const cached = storage.get<ExchangeRateCache>(KEYS.rates(baseCurrency));
      if (!force && cached && new Date(cached.expiresAt) > new Date()) {
        setRates(cached.rates);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const newRates = await fetchLiveRates(baseCurrency);
        storage.set(KEYS.rates(baseCurrency), {
          base: baseCurrency,
          rates: newRates,
          fetchedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + TTL_MS).toISOString(),
        } satisfies ExchangeRateCache);
        setRates(newRates);
      } catch {
        setError('Could not fetch live rates. Enter rate manually.');
      } finally {
        setLoading(false);
      }
    },
    [baseCurrency]
  );

  useEffect(() => {
    load();
  }, [load]);

  const getRate = useCallback(
    (from: CurrencyCode): number => {
      if (from === baseCurrency) return 1;
      return rates[from] ?? 1;
    },
    [rates, baseCurrency]
  );

  return { rates, loading, error, getRate, refresh: () => load(true) };
}
