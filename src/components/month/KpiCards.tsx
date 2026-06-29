import { fmt } from '@/lib/currency';
import type { MonthStats, CurrencyCode } from '@/types';

interface KpiCardsProps {
  stats: MonthStats;
  currency: CurrencyCode;
}

export function KpiCards({ stats, currency }: KpiCardsProps) {
  const cards = [
    {
      label: 'Left to Spend',
      value: stats.leftToSpend,
      bg: 'bg-yellow',
      alwaysInk: true,
    },
    {
      label: 'Total Income',
      value: stats.totalIncome,
      bg: 'bg-lime',
      alwaysInk: true,
    },
    {
      label: 'Total Expenses',
      value: stats.totalExpenses,
      bg: 'bg-pink',
      alwaysInk: false,
    },
    {
      label: 'Left to Budget',
      value: stats.leftToBudget,
      bg: stats.leftToBudget < 0 ? 'bg-pink' : 'bg-surface',
      alwaysInk: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 mt-4">
      {cards.map(({ label, value, bg, alwaysInk }) => (
        <div
          key={label}
          className={`rounded-2xl border-2 border-ink [box-shadow:3px_3px_0_#0A0A0A] p-4 ${bg}`}
        >
          <p className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p
            className={`font-display font-bold text-lg leading-tight break-all ${
              alwaysInk ? 'text-ink' : 'text-white'
            }`}
          >
            {value < 0 ? '-' : ''}
            {fmt(Math.abs(value), currency)}
          </p>
        </div>
      ))}
    </div>
  );
}
