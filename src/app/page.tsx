'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Gear, CalendarBlank, ArrowRight } from '@phosphor-icons/react';
import { format, parseISO } from 'date-fns';
import { useMonths } from '@/lib/hooks/useMonths';
import { useSettings } from '@/lib/hooks/useSettings';
import { fmt } from '@/lib/currency';
import { CreateMonthModal } from '@/components/modals/CreateMonthModal';
import { PageLayout } from '@/components/layout/PageLayout';
import { transactionRepository } from '@/lib/repositories/transactionRepository';
import { budgetRepository } from '@/lib/repositories/budgetRepository';
import { incomeRepository } from '@/lib/repositories/incomeRepository';
import { monthStats } from '@/lib/calculations';

function MonthCard({ month, onClick }: { month: ReturnType<typeof useMonths>['months'][0]; onClick: () => void }) {
  const transactions = transactionRepository.findByMonth(month.id);
  const categories = budgetRepository.findByMonth(month.id);
  const incomes = incomeRepository.findByMonth(month.id);
  const stats = monthStats(incomes, categories, transactions);
  const spendPct =
    stats.totalIncome > 0
      ? Math.min((stats.totalExpenses / stats.totalIncome) * 100, 100)
      : 0;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border-2 border-ink bg-surface [box-shadow:4px_4px_0_#0A0A0A] hover:[box-shadow:6px_6px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] transition-all overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-ink/10">
        <div>
          <h3 className="font-display font-bold text-lg text-ink">{month.name}</h3>
          <p className="text-ink/40 text-xs font-semibold">
            {format(parseISO(month.startDate), 'MMM d')} –{' '}
            {format(parseISO(month.endDate), 'MMM d, yyyy')}
          </p>
        </div>
        <ArrowRight size={20} weight="bold" className="text-ink/30" />
      </div>

      <div className="grid grid-cols-3 divide-x-2 divide-ink/10">
        <div className="px-4 py-3">
          <p className="text-xs text-ink/40 font-bold uppercase">Income</p>
          <p className="font-display font-bold text-sm text-ink mt-0.5">
            {fmt(stats.totalIncome, month.baseCurrency)}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-ink/40 font-bold uppercase">Spent</p>
          <p className="font-display font-bold text-sm text-pink mt-0.5">
            {fmt(stats.totalExpenses, month.baseCurrency)}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-ink/40 font-bold uppercase">Left</p>
          <p
            className={`font-display font-bold text-sm mt-0.5 ${stats.leftToSpend < 0 ? 'text-pink' : 'text-ink'}`}
          >
            {fmt(Math.abs(stats.leftToSpend), month.baseCurrency)}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="h-2 bg-ink/10 rounded-full overflow-hidden border border-ink/10">
          <div
            className={`h-full rounded-full transition-all ${spendPct > 90 ? 'bg-pink' : 'bg-lime'}`}
            style={{ width: `${spendPct}%` }}
          />
        </div>
        <p className="text-[10px] text-ink/40 font-bold mt-1">
          {spendPct.toFixed(0)}% of income spent
        </p>
      </div>
    </button>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { months, createMonth } = useMonths();
  useSettings(); // initialize settings
  const [showCreate, setShowCreate] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full p-5">
      {/* Logo */}
      <div className="pt-8 pb-5">
        <h1 className="font-display font-bold text-2xl text-ink tracking-tight">Montrack</h1>
        <p className="text-ink/40 text-xs font-semibold mt-0.5">Personal Finance Tracker</p>
      </div>

      <div className="border-t-2 border-ink/10 pt-4">
        <button
          onClick={() => setShowCreate(true)}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-ink bg-yellow font-display font-bold text-sm text-ink [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:5px_5px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] transition-all"
        >
          <Plus size={16} weight="bold" />
          New Month
        </button>
      </div>

      <div className="border-t-2 border-ink/10 mt-4 pt-4 flex-1 overflow-y-auto">
        <p className="text-[10px] font-black text-ink/40 uppercase tracking-wider mb-2 px-1">
          Months
        </p>
        {months.length === 0 ? (
          <p className="text-xs text-ink/30 font-semibold px-1">No months yet</p>
        ) : (
          <div className="space-y-1">
            {months.map((month) => (
              <button
                key={month.id}
                onClick={() => router.push(`/months/${month.id}`)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-ink hover:bg-ink/5 transition-colors truncate"
              >
                {month.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t-2 border-ink/10 pt-4 mt-4">
        <button
          onClick={() => router.push('/settings')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
        >
          <Gear size={16} weight="bold" />
          Settings
        </button>
      </div>
    </div>
  );

  return (
    <PageLayout sidebar={sidebar}>
      {/* Mobile header (hidden on desktop) */}
      <header className="md:hidden flex items-center justify-between px-5 pt-14 pb-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink tracking-tight">Montrack</h1>
          <p className="text-ink/40 text-sm font-semibold mt-0.5">
            {months.length} month{months.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button
          onClick={() => router.push('/settings')}
          className="w-10 h-10 rounded-xl border-2 border-ink bg-surface [box-shadow:2px_2px_0_#0A0A0A] flex items-center justify-center hover:[box-shadow:4px_4px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <Gear size={20} weight="bold" className="text-ink" />
        </button>
      </header>

      {/* Mobile CTA button */}
      <div className="md:hidden px-5 mt-2">
        <button
          onClick={() => setShowCreate(true)}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-ink bg-yellow font-display font-bold text-ink [box-shadow:4px_4px_0_#0A0A0A] hover:[box-shadow:6px_6px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] transition-all"
        >
          <span className="flex items-center gap-2">
            <Plus size={20} weight="bold" />
            New Month
          </span>
          <span className="text-ink/50 text-sm font-semibold">Track budget</span>
        </button>
      </div>

      {/* Desktop page header */}
      <div className="hidden md:block px-8 pt-10 pb-6">
        <h2 className="font-display font-bold text-3xl text-ink">All Months</h2>
        <p className="text-ink/40 text-sm font-semibold mt-1">
          {months.length} month{months.length !== 1 ? 's' : ''} tracked
        </p>
      </div>

      {/* Month list */}
      <div className="px-5 md:px-8 mt-6 md:mt-0 pb-10">
        {months.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CalendarBlank size={48} weight="bold" className="text-ink/20 mb-4" />
            <p className="font-display font-bold text-ink/40 text-lg">No months yet</p>
            <p className="text-ink/30 text-sm font-semibold mt-1">
              Create your first month to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {months.map((month) => (
              <MonthCard
                key={month.id}
                month={month}
                onClick={() => router.push(`/months/${month.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateMonthModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        existingMonths={months}
        onCreate={createMonth}
        onCreated={(m) => router.push(`/months/${m.id}`)}
      />
    </PageLayout>
  );
}
