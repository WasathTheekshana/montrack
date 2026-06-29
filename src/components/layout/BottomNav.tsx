'use client';

import { useState } from 'react';
import { House, ChartBar, Plus, Target, User } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'analytics', label: 'Charts', Icon: ChartBar },
  { id: 'add', label: '', Icon: Plus, isAction: true },
  { id: 'budget', label: 'Budget', Icon: Target },
  { id: 'profile', label: 'Profile', Icon: User },
];

export function BottomNav() {
  const [active, setActive] = useState('home');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
      <div className="mx-4 mb-6 bg-surface border-2 border-ink rounded-2xl px-2 py-2 [box-shadow:4px_4px_0_#0A0A0A]">
        <ul className="flex items-center justify-around">
          {navItems.map(({ id, label, Icon, isAction }) => {
            if (isAction) {
              return (
                <li key={id}>
                  <button className="w-14 h-14 -mt-8 rounded-xl bg-yellow border-2 border-ink [box-shadow:3px_3px_0_#0A0A0A] flex items-center justify-center active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_0_#0A0A0A] transition-all">
                    <Icon size={24} weight="bold" className="text-ink" />
                  </button>
                </li>
              );
            }
            const isActive = active === id;
            return (
              <li key={id}>
                <button
                  onClick={() => setActive(id)}
                  className={cn(
                    'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors',
                    isActive ? 'bg-yellow text-ink' : 'text-ink/40 hover:text-ink/70'
                  )}
                >
                  <Icon size={22} weight={isActive ? 'bold' : 'regular'} />
                  <span className="text-[10px] font-bold">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
