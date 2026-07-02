'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Gear, CalendarBlank, ArrowRight, ArrowUpRight, Trash, Heart } from '@phosphor-icons/react';
import { format, parseISO } from 'date-fns';
import { useMonths } from '@/lib/hooks/useMonths';
import { useSettings } from '@/lib/hooks/useSettings';
import { fmt } from '@/lib/currency';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { AppTour } from '@/components/ui/AppTour';
import { CreateMonthModal } from '@/components/modals/CreateMonthModal';
import { useTour } from '@/lib/hooks/useTour';
import { PageLayout } from '@/components/layout/PageLayout';
import { transactionRepository } from '@/lib/repositories/transactionRepository';
import { budgetRepository } from '@/lib/repositories/budgetRepository';
import { incomeRepository } from '@/lib/repositories/incomeRepository';
import { monthStats } from '@/lib/calculations';
import type { Month } from '@/types';

function MonthCard({
  month,
  onClick,
  onDelete,
}: {
  month: Month;
  onClick: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const transactions = transactionRepository.findByMonth(month.id);
  const categories = budgetRepository.findByMonth(month.id);
  const incomes = incomeRepository.findByMonth(month.id);
  const stats = monthStats(incomes, categories, transactions);
  const spendPct =
    stats.totalIncome > 0
      ? Math.min((stats.totalExpenses / stats.totalIncome) * 100, 100)
      : 0;

  return (
    <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:4px_4px_0_#0A0A0A] overflow-hidden">
      {/* Header — click opens month, trash icon in corner */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-ink/10">
        <button
          onClick={onClick}
          className="flex-1 min-w-0 text-left hover:opacity-70 transition-opacity"
        >
          <h3 className="font-display font-bold text-lg text-ink">{month.name}</h3>
          <p className="text-ink/40 text-xs font-semibold">
            {format(parseISO(month.startDate), 'MMM d')} –{' '}
            {format(parseISO(month.endDate), 'MMM d, yyyy')}
          </p>
        </button>

        {confirming ? (
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button
              onClick={() => { onDelete(); setConfirming(false); }}
              className="px-2.5 py-1 rounded-lg border-2 border-ink bg-pink text-white text-xs font-black [box-shadow:2px_2px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="px-2.5 py-1 rounded-lg border-2 border-ink bg-surface text-ink text-xs font-black [box-shadow:2px_2px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button
              onClick={() => setConfirming(true)}
              className="w-8 h-8 rounded-lg border-2 border-ink/20 flex items-center justify-center text-ink/30 hover:border-pink hover:text-pink hover:bg-pink/10 transition-all"
              aria-label="Delete month"
            >
              <Trash size={14} weight="bold" />
            </button>
            <button onClick={onClick} className="text-ink/30 hover:text-ink transition-colors">
              <ArrowRight size={20} weight="bold" />
            </button>
          </div>
        )}
      </div>

      {/* Stats — clicking anywhere navigates */}
      <button onClick={onClick} className="w-full text-left">
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
            <p className={`font-display font-bold text-sm mt-0.5 ${stats.leftToSpend < 0 ? 'text-pink' : 'text-ink'}`}>
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
    </div>
  );
}

function RecentTransactions({ months, onMonthClick }: { months: Month[]; onMonthClick: (id: string) => void }) {
  const recentTxs = useMemo(() => {
    const all = months.flatMap((m) => {
      const txs = transactionRepository.findByMonth(m.id);
      const cats = budgetRepository.findByMonth(m.id);
      return txs.map((tx) => ({
        ...tx,
        monthName: m.name,
        monthCurrency: m.baseCurrency,
        categoryName: cats.find((c) => c.id === tx.budgetCategoryId)?.name ?? '',
      }));
    });
    return all
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);
  }, [months]);

  return (
    <div>
      <h2 className="font-display font-bold text-base text-ink uppercase tracking-wider mb-3">
        Recent Transactions
      </h2>
      <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] overflow-hidden">
        {recentTxs.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <ArrowUpRight size={32} weight="bold" className="text-ink/20 mb-2" />
            <p className="text-ink/40 text-sm font-semibold">No transactions yet</p>
            <p className="text-ink/30 text-xs font-semibold mt-0.5">
              Open a month and add your first transaction
            </p>
          </div>
        ) : (
          recentTxs.map((tx, i) => (
            <button
              key={tx.id}
              onClick={() => onMonthClick(tx.monthId)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-yellow/10 transition-colors ${
                i < recentTxs.length - 1 ? 'border-b border-ink/10' : ''
              }`}
            >
              {/* Color indicator */}
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 border border-ink ${
                  tx.type === 'income' ? 'bg-lime' : 'bg-pink'
                }`}
              />

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">
                  {tx.description || tx.categoryName || (tx.type === 'income' ? 'Income' : 'Expense')}
                </p>
                <p className="text-xs text-ink/40 font-semibold">
                  {format(parseISO(tx.date), 'MMM d, yyyy')}
                  {tx.categoryName && tx.type !== 'income' && (
                    <span className="ml-1 text-ink/30">· {tx.categoryName}</span>
                  )}
                </p>
              </div>

              {/* Amount + month */}
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-black ${tx.type === 'income' ? 'text-lime' : 'text-pink'}`}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.convertedAmount, tx.monthCurrency)}
                </p>
                <span className="text-[10px] font-black text-ink/30 uppercase tracking-wide">
                  {tx.monthName}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { months, createMonth, deleteMonth } = useMonths();
  useSettings();
  const [showCreate, setShowCreate] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { show: showTour, completeTour } = useTour();

  if (!mounted) return <LoadingScreen />;

  const latestMonth = months[0];

  function handleFab() {
    if (latestMonth) {
      router.push(`/months/${latestMonth.id}`);
    } else {
      setShowCreate(true);
    }
  }

  const sidebar = (
    <div className="flex flex-col h-full p-5">
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

      <div className="border-t-2 border-ink/10 pt-4 mt-4 space-y-1">
        <button
          onClick={() => router.push('/settings')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
        >
          <Gear size={16} weight="bold" />
          Settings
        </button>
        <button
          onClick={() => router.push('/about')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
        >
          <Heart size={16} weight="bold" />
          About
        </button>
      </div>
    </div>
  );

  return (
    <PageLayout sidebar={sidebar}>
      {/* Mobile header */}
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

      {/* Mobile new month CTA */}
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
        <h2 className="font-display font-bold text-3xl text-ink">Dashboard</h2>
        <p className="text-ink/40 text-sm font-semibold mt-1">
          {months.length} month{months.length !== 1 ? 's' : ''} tracked
        </p>
      </div>

      {months.length === 0 ? (
        /* Empty state */
        <div className="px-5 md:px-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CalendarBlank size={48} weight="bold" className="text-ink/20 mb-4" />
            <p className="font-display font-bold text-ink/40 text-lg">No months yet</p>
            <p className="text-ink/30 text-sm font-semibold mt-1">
              Create your first month to get started
            </p>
          </div>
        </div>
      ) : (
        /* Content: mobile = stack, desktop = 2-column */
        <div className="md:grid md:grid-cols-[1fr_360px] md:gap-6 md:items-start md:px-8">
          {/* Left: Month cards */}
          <div className="px-5 md:px-0 mt-6 md:mt-0 pb-4">
            <h2 className="font-display font-bold text-base text-ink uppercase tracking-wider mb-3">
              Months
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
              {months.map((month) => (
                <MonthCard
                  key={month.id}
                  month={month}
                  onClick={() => router.push(`/months/${month.id}`)}
                  onDelete={() => deleteMonth(month.id)}
                />
              ))}
            </div>
          </div>

          {/* Right: Recent transactions — mobile shows below cards, desktop shows as sticky side panel */}
          <div className="px-5 md:px-0 mt-6 md:mt-0 pb-28 md:pb-10 md:sticky md:top-6">
            <RecentTransactions
              months={months}
              onMonthClick={(id) => router.push(`/months/${id}`)}
            />
          </div>
        </div>
      )}

      {/* Mobile FAB — floating add button */}
      <button
        onClick={handleFab}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl border-2 border-ink bg-yellow flex items-center justify-center [box-shadow:4px_4px_0_#0A0A0A] hover:[box-shadow:6px_6px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] transition-all"
        aria-label="Add transaction"
      >
        <Plus size={24} weight="bold" className="text-ink" />
      </button>

      <CreateMonthModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        existingMonths={months}
        onCreate={createMonth}
        onCreated={(m) => router.push(`/months/${m.id}`)}
      />

      {showTour && <AppTour onComplete={completeTour} />}
    </PageLayout>
  );
}
