import { storage, KEYS } from '../storage/adapter';
import type { Transaction } from '@/types';

export const transactionRepository = {
  findByMonth(monthId: string): Transaction[] {
    return storage.get<Transaction[]>(KEYS.transactions(monthId)) ?? [];
  },

  save(transaction: Transaction): Transaction {
    const list = this.findByMonth(transaction.monthId);
    const idx = list.findIndex((t) => t.id === transaction.id);
    if (idx >= 0) {
      list[idx] = transaction;
    } else {
      list.unshift(transaction);
    }
    storage.set(KEYS.transactions(transaction.monthId), list);
    return transaction;
  },

  delete(monthId: string, id: string): void {
    storage.set(
      KEYS.transactions(monthId),
      this.findByMonth(monthId).filter((t) => t.id !== id)
    );
  },
};
