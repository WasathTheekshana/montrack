import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export function Card({ children, className, color = 'bg-surface' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-ink',
        '[box-shadow:4px_4px_0_#0A0A0A]',
        color,
        className
      )}
    >
      {children}
    </div>
  );
}
