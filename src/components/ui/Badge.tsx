import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'income' | 'expense' | 'transfer' | 'neutral';
  className?: string;
}

const variantStyles: Record<string, string> = {
  income: 'bg-lime text-ink border-ink',
  expense: 'bg-pink text-white border-ink',
  transfer: 'bg-cyan text-ink border-ink',
  neutral: 'bg-white text-ink border-ink',
};

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
