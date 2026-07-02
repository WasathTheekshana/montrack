'use client';

import { useState } from 'react';
import {
  CalendarBlank,
  SquaresFour,
  CurrencyCircleDollar,
  ChartBar,
  DownloadSimple,
  CheckCircle,
  X,
  ArrowRight,
  ArrowLeft,
} from '@phosphor-icons/react';

interface Step {
  headerCls: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    headerCls: 'bg-yellow',
    icon: (
      <div className="w-16 h-16 rounded-2xl border-2 border-ink bg-ink flex items-center justify-center [box-shadow:4px_4px_0_#FFE135]">
        <span className="font-display font-black text-4xl text-yellow leading-none">M</span>
      </div>
    ),
    title: 'Welcome to Montrack',
    description: 'Your personal finance tracker. Private, offline, and open-source. Everything stays on your device — no account needed.',
  },
  {
    headerCls: 'bg-pink',
    icon: <CalendarBlank size={52} weight="bold" className="text-white" />,
    title: 'Start with a Month',
    description: 'Create a budget month with a start and end date. Each month keeps your income, bills, and spending separate and organised.',
  },
  {
    headerCls: 'bg-lime',
    icon: <SquaresFour size={52} weight="bold" className="text-ink" />,
    title: 'Set Your Budget',
    description: 'Add categories across four types — Bills, Expenses, Savings, and Debt. Set a budget amount for each one to stay in control.',
  },
  {
    headerCls: 'bg-yellow',
    icon: <CurrencyCircleDollar size={52} weight="bold" className="text-ink" />,
    title: 'Log Transactions',
    description: 'Record every income and expense against your categories. Log in any currency — all totals convert to your base currency automatically.',
  },
  {
    headerCls: 'bg-purple',
    icon: <ChartBar size={52} weight="bold" className="text-white" />,
    title: 'Track Your Progress',
    description: 'Use the Overview, Daily, and Charts tabs to see your spending breakdown, running daily balance, and category trends at a glance.',
  },
  {
    headerCls: 'bg-ink',
    icon: <DownloadSimple size={52} weight="bold" className="text-yellow" />,
    title: 'Back Up Your Data',
    description: 'Export all your months and transactions to a JSON file from Settings. Import it anytime to restore everything — even on a new device.',
  },
  {
    headerCls: 'bg-lime',
    icon: <CheckCircle size={52} weight="bold" className="text-ink" />,
    title: "You're All Set!",
    description: 'Hit the New Month button to create your first budget. You can replay this tour anytime from Settings.',
  },
];

interface AppTourProps {
  onComplete: () => void;
}

export function AppTour({ onComplete }: AppTourProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  function next() {
    if (isLast) {
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  }

  function back() {
    setStep((s) => s - 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm">
      <div
        className="w-full max-w-sm bg-surface border-2 border-ink rounded-2xl overflow-hidden [box-shadow:6px_6px_0_#0A0A0A]"
        style={{ animation: 'tourSlideIn 0.25s ease-out' }}
      >
        {/* Coloured header */}
        <div className={`relative ${current.headerCls} border-b-2 border-ink px-6 pt-8 pb-6 flex flex-col items-center gap-3`}>
          {/* Skip button */}
          <button
            onClick={onComplete}
            className="absolute top-3 right-3 w-7 h-7 rounded-lg border-2 border-ink/30 flex items-center justify-center text-ink/50 hover:border-ink hover:text-ink transition-all"
            aria-label="Skip tour"
          >
            <X size={12} weight="bold" />
          </button>

          {/* Step counter */}
          <span className="absolute top-3 left-3 text-[10px] font-black text-ink/50 uppercase tracking-widest">
            {step + 1} / {STEPS.length}
          </span>

          {current.icon}
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-4">
          <h2 className="font-display font-black text-xl text-ink leading-tight mb-2">
            {current.title}
          </h2>
          <p className="text-sm font-semibold text-ink/60 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`rounded-full border border-ink transition-all ${
                i === step
                  ? 'w-5 h-2 bg-yellow'
                  : i < step
                  ? 'w-2 h-2 bg-ink/30'
                  : 'w-2 h-2 bg-ink/10'
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-6 pb-6">
          {!isFirst ? (
            <button
              onClick={back}
              className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-ink bg-surface [box-shadow:2px_2px_0_#0A0A0A] hover:[box-shadow:3px_3px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all flex-shrink-0"
              aria-label="Previous step"
            >
              <ArrowLeft size={16} weight="bold" className="text-ink" />
            </button>
          ) : (
            <div className="w-10 flex-shrink-0" />
          )}

          <button
            onClick={next}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-ink bg-yellow font-display font-black text-sm text-ink [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:5px_5px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] transition-all"
          >
            {isLast ? 'Get started' : 'Next'}
            {!isLast && <ArrowRight size={14} weight="bold" />}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tourSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </div>
  );
}
