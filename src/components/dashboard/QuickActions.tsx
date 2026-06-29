import {
  ArrowFatUp,
  ArrowFatDown,
  ArrowsClockwise,
  Target,
} from '@phosphor-icons/react/dist/ssr';
import type { PhosphorIcon } from '@/lib/categoryIcons';

interface QuickAction {
  id: string;
  label: string;
  Icon: PhosphorIcon;
  color: string;
}

const actions: QuickAction[] = [
  { id: 'income', label: 'Add Income', Icon: ArrowFatUp as PhosphorIcon, color: 'bg-lime' },
  { id: 'expense', label: 'Add Expense', Icon: ArrowFatDown as PhosphorIcon, color: 'bg-pink' },
  { id: 'transfer', label: 'Transfer', Icon: ArrowsClockwise as PhosphorIcon, color: 'bg-cyan' },
  { id: 'budget', label: 'Budget', Icon: Target as PhosphorIcon, color: 'bg-orange' },
];

export function QuickActions() {
  return (
    <div className="px-5 mt-6">
      <h2 className="font-display font-bold text-xl text-ink mb-4">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-3">
        {actions.map(({ id, label, Icon, color }) => (
          <button
            key={id}
            className="flex flex-col items-center gap-2 active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            <div
              className={`w-full aspect-square rounded-xl border-2 border-ink [box-shadow:3px_3px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] flex items-center justify-center ${color}`}
            >
              <Icon size={26} weight="bold" className="text-ink" />
            </div>
            <span className="text-ink/70 text-xs font-bold text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
