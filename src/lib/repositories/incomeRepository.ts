import { storage, KEYS } from '../storage/adapter';
import type { Income } from '@/types';

export const incomeRepository = {
  findByMonth(monthId: string): Income[] {
    return storage.get<Income[]>(KEYS.income(monthId)) ?? [];
  },

  save(income: Income): Income {
    const list = this.findByMonth(income.monthId);
    const idx = list.findIndex((i) => i.id === income.id);
    if (idx >= 0) {
      list[idx] = income;
    } else {
      list.push(income);
    }
    storage.set(KEYS.income(income.monthId), list);
    return income;
  },

  delete(monthId: string, id: string): void {
    storage.set(
      KEYS.income(monthId),
      this.findByMonth(monthId).filter((i) => i.id !== id)
    );
  },
};
