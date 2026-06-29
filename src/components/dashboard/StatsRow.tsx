import { formatCurrency } from '@/lib/utils';
import type { WalletStats } from '@/types';

interface StatsRowProps {
  stats: WalletStats;
}

const statCards = [
  {
    key: 'income' as const,
    label: 'Income',
    emoji: '💰',
    bg: 'bg-lime',
  },
  {
    key: 'expenses' as const,
    label: 'Expenses',
    emoji: '💸',
    bg: 'bg-pink',
  },
  {
    key: 'savings' as const,
    label: 'Savings',
    emoji: '🏦',
    bg: 'bg-cyan',
  },
];

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="px-5 mt-4">
      <div className="grid grid-cols-3 gap-3">
        {statCards.map(({ key, label, emoji, bg }) => (
          <div
            key={key}
            className={`rounded-2xl border-2 border-ink [box-shadow:4px_4px_0_#0A0A0A] p-4 ${bg}`}
          >
            <span className="text-xl block mb-2">{emoji}</span>
            <p className="font-display font-bold text-sm text-ink leading-tight">
              {formatCurrency(stats[key])}
            </p>
            <p className="text-ink/60 text-xs font-bold mt-0.5 uppercase tracking-wide">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
