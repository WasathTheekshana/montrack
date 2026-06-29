import { storage, KEYS } from '../storage/adapter';
import type { Month } from '@/types';

export const monthRepository = {
  findAll(): Month[] {
    return storage.get<Month[]>(KEYS.months) ?? [];
  },

  findById(id: string): Month | undefined {
    return this.findAll().find((m) => m.id === id);
  },

  save(month: Month): Month {
    const months = this.findAll();
    const idx = months.findIndex((m) => m.id === month.id);
    if (idx >= 0) {
      months[idx] = month;
    } else {
      months.unshift(month);
    }
    storage.set(KEYS.months, months);
    return month;
  },

  delete(id: string): void {
    storage.set(
      KEYS.months,
      this.findAll().filter((m) => m.id !== id)
    );
    storage.remove(KEYS.income(id));
    storage.remove(KEYS.budget(id));
    storage.remove(KEYS.transactions(id));
  },
};
