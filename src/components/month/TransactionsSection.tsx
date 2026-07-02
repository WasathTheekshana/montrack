'use client';

import { useState } from 'react';
import { Plus, Trash, ArrowsLeftRight } from '@phosphor-icons/react';
import { fmt } from '@/lib/currency';
import { format, parseISO } from 'date-fns';
import type { Transaction, BudgetCategory, CurrencyCode } from '@/types';

interface TransactionsSectionProps {
  transactions: Transaction[];
  categories: BudgetCategory[];
  currency: CurrencyCode;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export function TransactionsSection({
  transactions,
  categories,
  currency,
  onAdd,
  onDelete,
}: TransactionsSectionProps) {
  const catMap = new Map(categories.map((c) => [c.id, c]));

  const typeChip: Record<string, { label: string; cls: string }> = {
    bills:    { label: 'Bills',    cls: 'bg-yellow text-ink' },
    expenses: { label: 'Expense',  cls: 'bg-pink text-white' },
    savings:  { label: 'Savings',  cls: 'bg-lime text-ink' },
    debt:     { label: 'Debt',     cls: 'bg-purple text-white' },
    income:   { label: 'Income',   cls: 'bg-lime text-ink' },
  };
  // Track which transaction rows are showing original currency
  const [showOriginal, setShowOriginal] = useState<Set<string>>(new Set());

  const hasForeignTx = transactions.some((tx) => tx.currency !== currency);

  function toggleOriginal(id: string) {
    setShowOriginal((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="px-5 mt-5 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-base text-ink uppercase tracking-wider">
            Transactions
          </h2>
          {hasForeignTx && (
            <span className="text-[10px] font-black text-ink/40 uppercase tracking-wide">
              · tap amount to toggle original
            </span>
          )}
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-xs font-black text-ink border-2 border-ink rounded-lg px-2.5 py-1 bg-yellow [box-shadow:2px_2px_0_#0A0A0A] hover:[box-shadow:3px_3px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <Plus size={12} weight="bold" /> Add
        </button>
      </div>

      <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-2 px-4 py-2 bg-ink border-b-2 border-ink">
          {['Date', 'Budget / Note', 'Amount', ''].map((h) => (
            <span key={h} className="text-xs font-black text-surface uppercase">
              {h}
            </span>
          ))}
        </div>

        {transactions.length === 0 ? (
          <p className="text-center text-ink/40 text-sm py-8 font-semibold">
            No transactions yet
          </p>
        ) : (
          transactions.map((tx, i) => {
            const isForeign = tx.currency !== currency;
            const isShowingOriginal = showOriginal.has(tx.id);

            return (
              <div
                key={tx.id}
                className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 px-4 py-3 ${
                  i < transactions.length - 1 ? 'border-b border-ink/10' : ''
                }`}
              >
                <span className="text-xs font-bold text-ink/60 whitespace-nowrap">
                  {format(parseISO(tx.date), 'MMM-d')}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-bold text-ink truncate">
                      {tx.type === 'income'
                        ? 'Income'
                        : (catMap.get(tx.budgetCategoryId)?.name ?? 'Uncategorised')}
                    </p>
                    {(() => {
                      const chip = tx.type === 'income'
                        ? typeChip.income
                        : typeChip[catMap.get(tx.budgetCategoryId)?.type ?? ''];
                      return chip ? (
                        <span className={`inline-flex items-center px-1.5 py-0 rounded-md border border-ink text-[9px] font-black uppercase tracking-wide flex-shrink-0 ${chip.cls}`}>
                          {chip.label}
                        </span>
                      ) : null;
                    })()}
                  </div>
                  {tx.description && (
                    <p className="text-xs text-ink/50 truncate">{tx.description}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-0.5">
                  {isForeign ? (
                    <button
                      onClick={() => toggleOriginal(tx.id)}
                      className={`flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-lg border border-ink whitespace-nowrap transition-all hover:scale-105 ${
                        tx.type === 'income' ? 'bg-lime text-ink' : 'bg-pink text-white'
                      }`}
                      title={
                        isShowingOriginal
                          ? `Converted: ${fmt(tx.convertedAmount, currency)}`
                          : `Original: ${tx.currency} ${tx.originalAmount.toFixed(2)}`
                      }
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {isShowingOriginal
                        ? `${tx.currency} ${tx.originalAmount.toFixed(2)}`
                        : fmt(tx.convertedAmount, currency)}
                      <ArrowsLeftRight size={9} weight="bold" className="opacity-70 flex-shrink-0" />
                    </button>
                  ) : (
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-lg border border-ink whitespace-nowrap ${
                        tx.type === 'income' ? 'bg-lime text-ink' : 'bg-pink text-white'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {fmt(tx.convertedAmount, currency)}
                    </span>
                  )}
                  {isForeign && !isShowingOriginal && (
                    <span className="text-[9px] font-bold text-ink/30 whitespace-nowrap">
                      {tx.currency} {tx.originalAmount.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onDelete(tx.id)}
                  className="text-ink/30 hover:text-pink transition-colors"
                >
                  <Trash size={14} weight="bold" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
