'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage, KEYS } from '../storage/adapter';
import { fetchLiveRates } from '../currency';
import type { ExchangeRateCache, CurrencyCode } from '@/types';

const TTL_MS = 60 * 60 * 1000;

export function useCurrency(baseCurrency: CurrencyCode) {
  const [rates, setRates] = useState<Record<string, number>>({ [baseCurrency]: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Incrementing this triggers a force-refresh of the rates
  const [fetchTick, setFetchTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const force = fetchTick > 0;

    // Async function so setState calls after await are non-blocking
    async function run() {
      const cached = storage.get<ExchangeRateCache>(KEYS.rates(baseCurrency));
      if (!force && cached && new Date(cached.expiresAt) > new Date()) {
        if (!cancelled) setRates(cached.rates);
        return;
      }
      if (!cancelled) setLoading(true);
      if (!cancelled) setError(null);
      try {
        const newRates = await fetchLiveRates(baseCurrency);
        storage.set(KEYS.rates(baseCurrency), {
          base: baseCurrency,
          rates: newRates,
          fetchedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + TTL_MS).toISOString(),
        } satisfies ExchangeRateCache);
        if (!cancelled) setRates(newRates);
      } catch {
        if (!cancelled) setError('Could not fetch live rates. Enter rate manually.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [baseCurrency, fetchTick]);

  const getRate = useCallback(
    (from: CurrencyCode): number => {
      if (from === baseCurrency) return 1;
      return rates[from] ?? 1;
    },
    [rates, baseCurrency]
  );

  return {
    rates,
    loading,
    error,
    getRate,
    refresh: () => setFetchTick((n) => n + 1),
  };
}
