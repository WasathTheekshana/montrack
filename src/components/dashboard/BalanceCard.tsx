import { formatCurrency } from '@/lib/utils';
import type { WalletStats } from '@/types';

interface BalanceCardProps {
  stats: WalletStats;
}

export function BalanceCard({ stats }: BalanceCardProps) {
  const isPositive = stats.changePercent >= 0;
  const spendRatio = Math.min((stats.expenses / stats.income) * 100, 100);

  return (
    <div className="mx-5 mt-2">
      <div className="rounded-2xl border-2 border-ink bg-yellow [box-shadow:6px_6px_0_#0A0A0A] p-6">
        {/* Label */}
        <p className="text-ink/60 text-xs font-bold uppercase tracking-widest">
          Total Balance
        </p>

        {/* Big number */}
        <div className="mt-2 font-display font-bold text-5xl text-ink tracking-tight leading-none">
          {formatCurrency(stats.totalBalance)}
        </div>

        {/* Change pill */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full border-2 border-ink ${
              isPositive ? 'bg-lime text-ink' : 'bg-pink text-white'
            }`}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(stats.changePercent)}%
          </span>
          <span className="text-ink/50 text-xs font-semibold">vs last month</span>
        </div>

        {/* Spend bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs font-bold text-ink/60 mb-2">
            <span>Monthly spend</span>
            <span>
              {formatCurrency(stats.expenses)} / {formatCurrency(stats.income)}
            </span>
          </div>
          <div className="h-3 bg-ink/10 rounded-full border border-ink/20 overflow-hidden">
            <div
              className="h-full bg-ink rounded-full transition-all"
              style={{ width: `${spendRatio}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
