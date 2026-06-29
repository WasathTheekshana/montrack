'use client';

import { Plus, Trash } from '@phosphor-icons/react';
import { fmt } from '@/lib/currency';
import type { Income, Transaction, CurrencyCode } from '@/types';
import { actualIncome } from '@/lib/calculations';

interface IncomeSectionProps {
  incomes: Income[];
  transactions: Transaction[];
  currency: CurrencyCode;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export function IncomeSection({
  incomes,
  transactions,
  currency,
  onAdd,
  onDelete,
}: IncomeSectionProps) {
  const totalExpected = incomes.reduce((s, i) => s + i.expectedAmount, 0);
  const totalActual = actualIncome(transactions);

  return (
    <div className="px-5 mt-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-base text-ink uppercase tracking-wider">
          Income
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-xs font-black text-ink border-2 border-ink rounded-lg px-2.5 py-1 bg-lime [box-shadow:2px_2px_0_#0A0A0A] hover:[box-shadow:3px_3px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <Plus size={12} weight="bold" /> Add
        </button>
      </div>

      <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-2 bg-lime border-b-2 border-ink">
          <span className="text-xs font-black text-ink uppercase">Name</span>
          <span className="text-xs font-black text-ink uppercase">Expected</span>
          <span className="text-xs font-black text-ink uppercase">Actual</span>
        </div>

        {incomes.length === 0 ? (
          <p className="text-center text-ink/40 text-sm py-6 font-semibold">
            No income added yet
          </p>
        ) : (
          incomes.map((income, i) => (
            <div
              key={income.id}
              className={`grid grid-cols-[1fr_auto_auto] items-center gap-2 px-4 py-3 ${
                i < incomes.length - 1 ? 'border-b border-ink/10' : ''
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink truncate">{income.name}</p>
                <p className="text-xs text-ink/40 font-semibold">Pay: {income.payday}</p>
              </div>
              <span className="text-sm font-bold text-ink whitespace-nowrap">
                {fmt(income.expectedAmount, currency)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-ink whitespace-nowrap">
                  {fmt(
                    transactions
                      .filter((t) => t.type === 'income')
                      .reduce((s, t) => s + t.convertedAmount, 0),
                    currency
                  )}
                </span>
                <button
                  onClick={() => onDelete(income.id)}
                  className="text-ink/30 hover:text-pink transition-colors"
                >
                  <Trash size={14} weight="bold" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Total row */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-3 bg-ink/5 border-t-2 border-ink">
          <span className="text-sm font-black text-ink uppercase">Total</span>
          <span className="text-sm font-black text-ink whitespace-nowrap">
            {fmt(totalExpected, currency)}
          </span>
          <span className="text-sm font-black text-ink whitespace-nowrap">
            {fmt(totalActual, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
