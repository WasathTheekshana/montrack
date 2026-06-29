'use client';

import { useState, useCallback } from 'react';
import { incomeRepository } from '../repositories/incomeRepository';
import type { Income } from '@/types';

export function useIncome(monthId: string) {
  const [incomes, setIncomes] = useState<Income[]>(() =>
    incomeRepository.findByMonth(monthId)
  );

  const refresh = useCallback(() => {
    setIncomes(incomeRepository.findByMonth(monthId));
  }, [monthId]);

  const addIncome = useCallback(
    (data: Omit<Income, 'id'>): Income => {
      const income: Income = { ...data, id: crypto.randomUUID() };
      incomeRepository.save(income);
      refresh();
      return income;
    },
    [refresh]
  );

  const deleteIncome = useCallback(
    (id: string) => {
      incomeRepository.delete(monthId, id);
      refresh();
    },
    [monthId, refresh]
  );

  return { incomes, addIncome, deleteIncome };
}
