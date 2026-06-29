'use client';

import { Plus, Trash, CheckCircle, Circle } from '@phosphor-icons/react';
import { fmt } from '@/lib/currency';
import { actualForCategory } from '@/lib/calculations';
import { BUDGET_TYPE_CONFIG } from '@/lib/constants';
import type { BudgetCategory, BudgetType, Transaction, CurrencyCode } from '@/types';

interface BudgetSectionProps {
  type: BudgetType;
  categories: BudgetCategory[];
  transactions: Transaction[];
  currency: CurrencyCode;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onTogglePaid?: (id: string) => void;
}

export function BudgetSection({
  type,
  categories,
  transactions,
  currency,
  onAdd,
  onDelete,
  onTogglePaid,
}: BudgetSectionProps) {
  const config = BUDGET_TYPE_CONFIG[type];
  const isBills = type === 'bills';
  const totalBudget = categories.reduce((s, c) => s + c.budgetAmount, 0);
  const totalActual = categories.reduce(
    (s, c) => s + actualForCategory(c.id, transactions),
    0
  );
  const totalDiff = totalBudget - totalActual;

  return (
    <div className="px-5 mt-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-base text-ink uppercase tracking-wider">
          {config.label}
        </h2>
        <button
          onClick={onAdd}
          className={`flex items-center gap-1 text-xs font-black text-ink border-2 border-ink rounded-lg px-2.5 py-1 ${config.bgClass} [box-shadow:2px_2px_0_#0A0A0A] hover:[box-shadow:3px_3px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all`}
        >
          <Plus size={12} weight="bold" /> Add
        </button>
      </div>

      <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] overflow-hidden">
        {/* Header */}
        <div
          className={`grid ${isBills ? 'grid-cols-[auto_1fr_auto_auto_auto_auto]' : 'grid-cols-[1fr_auto_auto_auto_auto]'} gap-2 px-4 py-2 ${config.bgClass} border-b-2 border-ink`}
        >
          {isBills && <span className="text-xs font-black text-ink uppercase w-5" />}
          <span className="text-xs font-black text-ink uppercase">Name</span>
          {isBills && (
            <span className="text-xs font-black text-ink uppercase">Due</span>
          )}
          <span className="text-xs font-black text-ink uppercase">Budget</span>
          <span className="text-xs font-black text-ink uppercase">Actual</span>
          <span className="text-xs font-black text-ink uppercase">Diff</span>
          <span className="w-5" />
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-ink/40 text-sm py-6 font-semibold">
            No items added yet
          </p>
        ) : (
          categories.map((cat, i) => {
            const actual = actualForCategory(cat.id, transactions);
            const diff = cat.budgetAmount - actual;
            return (
              <div
                key={cat.id}
                className={`grid ${isBills ? 'grid-cols-[auto_1fr_auto_auto_auto_auto]' : 'grid-cols-[1fr_auto_auto_auto_auto]'} items-center gap-2 px-4 py-3 ${
                  i < categories.length - 1 ? 'border-b border-ink/10' : ''
                }`}
              >
                {isBills && (
                  <button
                    onClick={() => onTogglePaid?.(cat.id)}
                    className="flex-shrink-0"
                  >
                    {cat.isPaid ? (
                      <CheckCircle size={18} weight="fill" className="text-lime" />
                    ) : (
                      <Circle size={18} weight="regular" className="text-ink/30" />
                    )}
                  </button>
                )}
                <p className="text-sm font-bold text-ink truncate">{cat.name}</p>
                {isBills && (
                  <span className="text-xs text-ink/50 font-semibold whitespace-nowrap">
                    {cat.dueDate ?? '—'}
                  </span>
                )}
                <span className="text-xs font-bold text-ink whitespace-nowrap">
                  {fmt(cat.budgetAmount, currency)}
                </span>
                <span className="text-xs font-bold text-ink whitespace-nowrap">
                  {fmt(actual, currency)}
                </span>
                <span
                  className={`text-xs font-bold whitespace-nowrap ${
                    diff < 0 ? 'text-pink' : diff === 0 ? 'text-ink/40' : 'text-ink'
                  }`}
                >
                  {diff < 0 ? '-' : ''}
                  {fmt(Math.abs(diff), currency)}
                </span>
                <button
                  onClick={() => onDelete(cat.id)}
                  className="text-ink/30 hover:text-pink transition-colors"
                >
                  <Trash size={14} weight="bold" />
                </button>
              </div>
            );
          })
        )}

        {/* Total row */}
        <div
          className={`grid ${isBills ? 'grid-cols-[auto_1fr_auto_auto_auto_auto]' : 'grid-cols-[1fr_auto_auto_auto_auto]'} gap-2 px-4 py-3 bg-ink/5 border-t-2 border-ink`}
        >
          {isBills && <span />}
          <span className="text-sm font-black text-ink uppercase">Total</span>
          {isBills && <span />}
          <span className="text-xs font-black text-ink whitespace-nowrap">
            {fmt(totalBudget, currency)}
          </span>
          <span className="text-xs font-black text-ink whitespace-nowrap">
            {fmt(totalActual, currency)}
          </span>
          <span
            className={`text-xs font-black whitespace-nowrap ${totalDiff < 0 ? 'text-pink' : 'text-ink'}`}
          >
            {totalDiff < 0 ? '-' : ''}
            {fmt(Math.abs(totalDiff), currency)}
          </span>
          <span />
        </div>
      </div>
    </div>
  );
}
