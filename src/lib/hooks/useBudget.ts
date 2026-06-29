'use client';

import { useState, useCallback } from 'react';
import { budgetRepository } from '../repositories/budgetRepository';
import type { BudgetCategory, BudgetType } from '@/types';

export function useBudget(monthId: string) {
  const [categories, setCategories] = useState<BudgetCategory[]>(() =>
    budgetRepository.findByMonth(monthId)
  );

  const refresh = useCallback(() => {
    setCategories(budgetRepository.findByMonth(monthId));
  }, [monthId]);

  const addCategory = useCallback(
    (data: Omit<BudgetCategory, 'id'>): BudgetCategory => {
      const cat: BudgetCategory = { ...data, id: crypto.randomUUID() };
      budgetRepository.save(cat);
      refresh();
      return cat;
    },
    [refresh]
  );

  const updateCategory = useCallback(
    (cat: BudgetCategory) => {
      budgetRepository.save(cat);
      refresh();
    },
    [refresh]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      budgetRepository.delete(monthId, id);
      refresh();
    },
    [monthId, refresh]
  );

  const togglePaid = useCallback(
    (id: string) => {
      budgetRepository.togglePaid(monthId, id);
      refresh();
    },
    [monthId, refresh]
  );

  const byType = useCallback(
    (type: BudgetType) => categories.filter((c) => c.type === type),
    [categories]
  );

  return { categories, addCategory, updateCategory, deleteCategory, togglePaid, byType };
}
