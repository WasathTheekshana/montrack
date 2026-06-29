'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { BUDGET_TYPE_CONFIG } from '@/lib/constants';
import type { BudgetType } from '@/types';

interface AddBudgetItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: BudgetType;
  monthId: string;
  nextOrder: number;
  onAdd: (data: {
    monthId: string;
    type: BudgetType;
    name: string;
    budgetAmount: number;
    dueDate?: string;
    isPaid: boolean;
    order: number;
  }) => void;
}

export function AddBudgetItemModal({
  isOpen,
  onClose,
  type,
  monthId,
  nextOrder,
  onAdd,
}: AddBudgetItemModalProps) {
  const [name, setName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const config = BUDGET_TYPE_CONFIG[type];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      monthId,
      type,
      name,
      budgetAmount: parseFloat(budgetAmount) || 0,
      dueDate: dueDate || undefined,
      isPaid: false,
      order: nextOrder,
    });
    setName('');
    setBudgetAmount('');
    setDueDate('');
    onClose();
  }

  const inputCls =
    'w-full border-2 border-ink rounded-xl px-3 py-2.5 text-sm font-semibold text-ink bg-background focus:outline-none focus:ring-2 focus:ring-yellow [box-shadow:2px_2px_0_#0A0A0A]';
  const labelCls = 'block text-xs font-black text-ink/60 uppercase tracking-wider mb-1';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add to ${config.label}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Name</label>
          <input
            className={inputCls}
            placeholder={type === 'bills' ? 'e.g. BL - Internet' : 'e.g. EX - Groceries'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelCls}>Budget Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className={inputCls}
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            required
          />
        </div>

        {type === 'bills' && (
          <div>
            <label className={labelCls}>Due Date</label>
            <input
              type="date"
              className={inputCls}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3 rounded-xl border-2 border-ink font-display font-bold text-ink [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:5px_5px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] transition-all ${config.bgClass}`}
        >
          Add Item
        </button>
      </form>
    </Modal>
  );
}
