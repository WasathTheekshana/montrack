'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { NumberInput } from '@/components/ui/NumberInput';
import { BUDGET_TYPE_CONFIG } from '@/lib/constants';
import type { BudgetType } from '@/types';

const NAME_PLACEHOLDERS: Record<BudgetType, string> = {
  bills: 'e.g. Internet bill, Netflix subscription',
  expenses: 'e.g. Groceries, Gym & Fitness',
  savings: 'e.g. Emergency Fund, Travel savings',
  debt: 'e.g. Credit card, Loan payment',
};

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
    description?: string;
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
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const config = BUDGET_TYPE_CONFIG[type];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      monthId,
      type,
      name,
      budgetAmount: parseFloat(budgetAmount) || 0,
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      isPaid: false,
      order: nextOrder,
    });
    setName('');
    setBudgetAmount('');
    setDescription('');
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
            placeholder={NAME_PLACEHOLDERS[type]}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelCls}>Budget Amount</label>
          <NumberInput
            placeholder="0.00"
            className={inputCls}
            value={budgetAmount}
            onChange={setBudgetAmount}
            required
          />
        </div>

        <div>
          <label className={labelCls}>
            Description{' '}
            <span className="text-ink/30 normal-case font-semibold">(optional)</span>
          </label>
          <textarea
            className={`${inputCls} resize-none`}
            placeholder="Add a note or description…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
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
