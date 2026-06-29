'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage, KEYS } from '../storage/adapter';
import type { AppSettings } from '@/types';

const DEFAULT: AppSettings = { baseCurrency: 'LKR' };

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT);

  useEffect(() => {
    const saved = storage.get<AppSettings>(KEYS.settings);
    if (saved) setSettings(saved);
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      storage.set(KEYS.settings, next);
      return next;
    });
  }, []);

  return { settings, updateSettings };
}
