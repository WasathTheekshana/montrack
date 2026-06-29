import { storage, KEYS } from '../storage/adapter';
import type { BudgetCategory, BudgetType } from '@/types';

export const budgetRepository = {
  findByMonth(monthId: string): BudgetCategory[] {
    return storage.get<BudgetCategory[]>(KEYS.budget(monthId)) ?? [];
  },

  findByType(monthId: string, type: BudgetType): BudgetCategory[] {
    return this.findByMonth(monthId).filter((c) => c.type === type);
  },

  save(category: BudgetCategory): BudgetCategory {
    const list = this.findByMonth(category.monthId);
    const idx = list.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      list[idx] = category;
    } else {
      list.push(category);
    }
    storage.set(KEYS.budget(category.monthId), list);
    return category;
  },

  saveMany(monthId: string, categories: BudgetCategory[]): void {
    storage.set(KEYS.budget(monthId), categories);
  },

  delete(monthId: string, id: string): void {
    storage.set(
      KEYS.budget(monthId),
      this.findByMonth(monthId).filter((c) => c.id !== id)
    );
  },

  togglePaid(monthId: string, id: string): void {
    const list = this.findByMonth(monthId);
    const item = list.find((c) => c.id === id);
    if (item) {
      item.isPaid = !item.isPaid;
      storage.set(KEYS.budget(monthId), list);
    }
  },
};
