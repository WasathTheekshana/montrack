import { formatCurrency, formatDate } from '@/lib/utils';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { Badge } from '@/components/ui/Badge';
import type { Transaction } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="px-5 mt-6 pb-36">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl text-ink">Recent</h2>
        <button className="text-xs font-black text-ink underline underline-offset-2 hover:no-underline">
          See all →
        </button>
      </div>

      <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:4px_4px_0_#0A0A0A] overflow-hidden">
        {transactions.map((tx, i) => {
          const CategoryIcon = getCategoryIcon(tx.category);
          return (
            <div
              key={tx.id}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                i !== transactions.length - 1 ? 'border-b-2 border-ink/10' : ''
              }`}
            >
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl border-2 border-ink flex items-center justify-center flex-shrink-0 [box-shadow:2px_2px_0_#0A0A0A] ${
                  tx.type === 'income' ? 'bg-lime' : 'bg-yellow'
                }`}
              >
                <CategoryIcon size={20} weight="bold" className="text-ink" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-ink font-bold text-sm truncate">{tx.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant={tx.type}>{tx.category}</Badge>
                  <span className="text-ink/40 text-xs font-semibold">{formatDate(tx.date)}</span>
                </div>
              </div>

              {/* Amount */}
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg border-2 border-ink text-xs font-black [box-shadow:2px_2px_0_#0A0A0A] ${
                  tx.type === 'income' ? 'bg-lime text-ink' : 'bg-pink text-white'
                }`}
              >
                {tx.type === 'income' ? '+' : '−'}
                {formatCurrency(tx.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
