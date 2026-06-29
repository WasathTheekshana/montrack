'use client';

import { useState, useCallback } from 'react';
import { transactionRepository } from '../repositories/transactionRepository';
import type { Transaction } from '@/types';

export function useTransactions(monthId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    transactionRepository.findByMonth(monthId)
  );

  const refresh = useCallback(() => {
    setTransactions(transactionRepository.findByMonth(monthId));
  }, [monthId]);

  const addTransaction = useCallback(
    (data: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
      const tx: Transaction = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      transactionRepository.save(tx);
      refresh();
      return tx;
    },
    [refresh]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      transactionRepository.delete(monthId, id);
      refresh();
    },
    [monthId, refresh]
  );

  return { transactions, addTransaction, deleteTransaction };
}
