'use client';

import { useState, useRef, useEffect } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { BUDGET_TYPE_CONFIG } from '@/lib/constants';
import type { BudgetCategory, BudgetType } from '@/types';

const TYPE_CHIP_CLASS: Record<BudgetType, string> = {
  bills: 'bg-orange text-ink border-ink',
  expenses: 'bg-pink text-white border-pink',
  savings: 'bg-lime text-ink border-ink',
  debt: 'bg-yellow text-ink border-ink',
};

const BUDGET_TYPES: BudgetType[] = ['bills', 'expenses', 'savings', 'debt'];

interface CategorySelectProps {
  categories: BudgetCategory[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function CategorySelect({
  categories,
  value,
  onChange,
  placeholder = 'Select category…',
  required,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectedCat = categories.find((c) => c.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between border-2 border-ink rounded-xl px-3 py-2.5 pr-9 text-sm font-semibold text-ink bg-background focus:outline-none focus:ring-2 focus:ring-yellow [box-shadow:2px_2px_0_#0A0A0A] text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedCat ? (
          <span className="flex items-center gap-2">
            <span
              className={cn(
                'inline-block text-[10px] font-black border px-1.5 py-0.5 rounded uppercase tracking-wide',
                TYPE_CHIP_CLASS[selectedCat.type]
              )}
            >
              {BUDGET_TYPE_CONFIG[selectedCat.type].label.slice(0, 3).toUpperCase()}
            </span>
            <span className="truncate">{selectedCat.name}</span>
          </span>
        ) : (
          <span className="text-ink/40">{placeholder}</span>
        )}
        <CaretDown
          size={14}
          weight="bold"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink"
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full border-2 border-ink rounded-xl bg-background [box-shadow:4px_4px_0_#0A0A0A] overflow-hidden">
          <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
            {BUDGET_TYPES.map((type) => {
              const group = categories.filter((c) => c.type === type);
              if (group.length === 0) return null;
              return (
                <li key={type}>
                  <div className="px-3 py-1 text-[10px] font-black text-ink/40 uppercase tracking-wider border-b border-ink/10">
                    {BUDGET_TYPE_CONFIG[type].label}
                  </div>
                  {group.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      role="option"
                      aria-selected={cat.id === value}
                      onClick={() => {
                        onChange(cat.id);
                        setOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-ink text-left transition-colors',
                        cat.id === value ? 'bg-yellow' : 'hover:bg-yellow/20'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block text-[10px] font-black border px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0',
                          TYPE_CHIP_CLASS[cat.type]
                        )}
                      >
                        {cat.type.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </li>
              );
            })}
            {categories.length === 0 && (
              <li className="px-3 py-4 text-sm text-ink/40 text-center font-semibold">
                No categories yet
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Hidden native select for form validation */}
      {required && (
        <select
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
          value={value}
          onChange={() => {}}
          required={required}
        >
          <option value="" />
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
