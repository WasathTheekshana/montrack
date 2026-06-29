'use client';

import { useState, useEffect, useCallback } from 'react';
import { monthRepository } from '../repositories/monthRepository';
import type { Month } from '@/types';

export function useMonths() {
  const [months, setMonths] = useState<Month[]>([]);

  const refresh = useCallback(() => {
    setMonths(monthRepository.findAll());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createMonth = useCallback(
    (data: Omit<Month, 'id' | 'createdAt'>): Month => {
      const month: Month = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      monthRepository.save(month);
      refresh();
      return month;
    },
    [refresh]
  );

  const deleteMonth = useCallback(
    (id: string) => {
      monthRepository.delete(id);
      refresh();
    },
    [refresh]
  );

  return { months, createMonth, deleteMonth, refresh };
}
