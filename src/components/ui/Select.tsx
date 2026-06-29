import { CaretDown } from '@phosphor-icons/react/dist/ssr';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function Select({ children, className, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full appearance-none border-2 border-ink rounded-xl px-3 py-2.5 pr-9 text-sm font-semibold text-ink bg-background focus:outline-none focus:ring-2 focus:ring-yellow [box-shadow:2px_2px_0_#0A0A0A] ${className ?? ''}`}
      >
        {children}
      </select>
      <CaretDown
        size={14}
        weight="bold"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink"
      />
    </div>
  );
}
