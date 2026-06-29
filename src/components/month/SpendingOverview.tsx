import { fmt } from '@/lib/currency';
import { BUDGET_TYPE_CONFIG } from '@/lib/constants';
import type { BudgetSummary, CurrencyCode } from '@/types';

interface SpendingOverviewProps {
  summaries: BudgetSummary[];
  currency: CurrencyCode;
}

export function SpendingOverview({ summaries, currency }: SpendingOverviewProps) {
  const totalBudget = summaries.reduce((s, b) => s + b.budget, 0);
  const totalActual = summaries.reduce((s, b) => s + b.actual, 0);
  const totalDiff = totalBudget - totalActual;

  return (
    <div className="px-5 mt-5">
      <h2 className="font-display font-bold text-base text-ink uppercase tracking-wider mb-3">
        Spending Overview
      </h2>
      <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-2 bg-ink border-b-2 border-ink">
          {['Budget Name', 'Budget', 'Actual', 'Diff.'].map((h) => (
            <span key={h} className="text-xs font-black text-surface uppercase">
              {h}
            </span>
          ))}
        </div>
        {summaries.map(({ type, budget, actual, diff }) => {
          const config = BUDGET_TYPE_CONFIG[type];
          return (
            <div
              key={type}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center px-4 py-3 border-b border-ink/10"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full border border-ink ${config.bgClass}`}
                />
                <span className="text-sm font-bold text-ink capitalize">{type}</span>
              </div>
              <span className="text-sm font-bold text-ink whitespace-nowrap">
                {fmt(budget, currency)}
              </span>
              <span className="text-sm font-bold text-ink whitespace-nowrap">
                {fmt(actual, currency)}
              </span>
              <span
                className={`text-sm font-bold whitespace-nowrap ${diff < 0 ? 'text-pink' : 'text-ink'}`}
              >
                {diff < 0 ? '-' : ''}
                {fmt(Math.abs(diff), currency)}
              </span>
            </div>
          );
        })}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-3 bg-ink/5">
          <span className="text-sm font-black text-ink uppercase">Total</span>
          <span className="text-sm font-black text-ink whitespace-nowrap">
            {fmt(totalBudget, currency)}
          </span>
          <span className="text-sm font-black text-ink whitespace-nowrap">
            {fmt(totalActual, currency)}
          </span>
          <span
            className={`text-sm font-black whitespace-nowrap ${totalDiff < 0 ? 'text-pink' : 'text-ink'}`}
          >
            {totalDiff < 0 ? '-' : ''}
            {fmt(Math.abs(totalDiff), currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
