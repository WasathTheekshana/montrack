'use client';

import { useState, useCallback } from 'react';
import { storage, KEYS } from '../storage/adapter';
import type { AppSettings } from '@/types';

const DEFAULT: AppSettings = { baseCurrency: 'LKR' };

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(
    () => storage.get<AppSettings>(KEYS.settings) ?? DEFAULT
  );

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      storage.set(KEYS.settings, next);
      return next;
    });
  }, []);

  return { settings, updateSettings };
}
