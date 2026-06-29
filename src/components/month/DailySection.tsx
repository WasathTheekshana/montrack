import { fmt } from '@/lib/currency';
import { format, parseISO } from 'date-fns';
import type { DailySpending, CurrencyCode } from '@/types';

interface DailySectionProps {
  days: DailySpending[];
  currency: CurrencyCode;
}

export function DailySection({ days, currency }: DailySectionProps) {
  return (
    <div className="px-5 mt-5 pb-4">
      <h2 className="font-display font-bold text-base text-ink uppercase tracking-wider mb-3">
        Daily Spendings
      </h2>
      <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] overflow-hidden">
        <div className="grid grid-cols-[auto_auto_auto_auto] gap-2 px-4 py-2 bg-ink border-b-2 border-ink">
          {['Date', 'Spent', 'Income', 'Balance'].map((h) => (
            <span key={h} className="text-xs font-black text-surface uppercase">
              {h}
            </span>
          ))}
        </div>
        {days.map((day, i) => {
          const hasActivity = day.spent > 0 || day.income > 0;
          return (
            <div
              key={day.date}
              className={`grid grid-cols-[auto_auto_auto_auto] gap-2 items-center px-4 py-2.5 ${
                i < days.length - 1 ? 'border-b border-ink/10' : ''
              } ${hasActivity ? 'bg-yellow/10' : ''}`}
            >
              <span className="text-xs font-bold text-ink/60 whitespace-nowrap">
                {format(parseISO(day.date), 'MMM-d')}
              </span>
              <span
                className={`text-xs font-bold whitespace-nowrap ${
                  day.spent > 0 ? 'text-pink' : 'text-ink/30'
                }`}
              >
                {fmt(day.spent, currency)}
              </span>
              <span
                className={`text-xs font-bold whitespace-nowrap ${
                  day.income > 0 ? 'text-ink' : 'text-ink/30'
                }`}
              >
                {fmt(day.income, currency)}
              </span>
              <span className="text-xs font-bold text-ink whitespace-nowrap">
                {fmt(day.balance, currency)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
