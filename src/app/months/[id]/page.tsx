'use client';

import { useState, use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from '@phosphor-icons/react';
import { format, parseISO } from 'date-fns';

import { monthRepository } from '@/lib/repositories/monthRepository';
import { useBudget } from '@/lib/hooks/useBudget';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useIncome } from '@/lib/hooks/useIncome';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { budgetSummaries, monthStats, dailySpendings } from '@/lib/calculations';

import { KpiCards } from '@/components/month/KpiCards';
import { IncomeSection } from '@/components/month/IncomeSection';
import { BudgetSection } from '@/components/month/BudgetSection';
import { SpendingOverview } from '@/components/month/SpendingOverview';
import { TransactionsSection } from '@/components/month/TransactionsSection';
import { DailySection } from '@/components/month/DailySection';
import { SpendingChart } from '@/components/month/SpendingChart';
import { AddTransactionModal } from '@/components/modals/AddTransactionModal';
import { AddBudgetItemModal } from '@/components/modals/AddBudgetItemModal';
import { AddIncomeModal } from '@/components/modals/AddIncomeModal';
import { cn } from '@/lib/utils';
import type { BudgetType } from '@/types';

type Tab = 'overview' | 'budget' | 'transactions' | 'daily';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'budget', label: 'Budget' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'daily', label: 'Daily' },
];

export default function MonthPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const month = monthRepository.findById(id);
  const { categories, addCategory, deleteCategory, togglePaid, byType } = useBudget(id);
  const { transactions, addTransaction, deleteTransaction } = useTransactions(id);
  const { incomes, addIncome, deleteIncome } = useIncome(id);
  const { getRate, loading: ratesLoading } = useCurrency(month?.baseCurrency ?? 'LKR');

  const [tab, setTab] = useState<Tab>('overview');
  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [addBudgetType, setAddBudgetType] = useState<BudgetType | null>(null);

  const currency = month?.baseCurrency ?? 'LKR';

  const stats = useMemo(
    () => monthStats(incomes, categories, transactions),
    [incomes, categories, transactions]
  );

  const summaries = useMemo(
    () => budgetSummaries(categories, transactions),
    [categories, transactions]
  );

  const dailyData = useMemo(() => {
    if (!month) return [];
    return dailySpendings(month.startDate, month.endDate, transactions, stats.totalIncome);
  }, [month, transactions, stats.totalIncome]);

  if (!month) {
    return (
      <main className="max-w-md mx-auto min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-display font-bold text-ink/40">Month not found</p>
          <button onClick={() => router.push('/')} className="mt-4 text-sm font-bold text-ink underline">
            Go home
          </button>
        </div>
      </main>
    );
  }

  const budgetTypes: BudgetType[] = ['bills', 'expenses', 'savings', 'debt'];

  return (
    <main className="max-w-md mx-auto min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background border-b-2 border-ink px-5 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="w-9 h-9 rounded-xl border-2 border-ink bg-surface [box-shadow:2px_2px_0_#0A0A0A] flex items-center justify-center hover:[box-shadow:4px_4px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            <ArrowLeft size={16} weight="bold" className="text-ink" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-xl text-ink truncate">{month.name}</h1>
            <p className="text-ink/40 text-xs font-semibold">
              {format(parseISO(month.startDate), 'MMM d')} –{' '}
              {format(parseISO(month.endDate), 'MMM d, yyyy')} · {currency}
            </p>
          </div>
          <button
            onClick={() => setShowAddTx(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-ink bg-yellow font-black text-xs text-ink [box-shadow:2px_2px_0_#0A0A0A] hover:[box-shadow:4px_4px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            <Plus size={14} weight="bold" /> Add
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3 overflow-x-auto no-scrollbar">
          {TABS.map(({ id: tabId, label }) => (
            <button
              key={tabId}
              onClick={() => setTab(tabId)}
              className={cn(
                'flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-black border-2 border-ink transition-all',
                tab === tabId
                  ? 'bg-ink text-surface [box-shadow:2px_2px_0_#0A0A0A]'
                  : 'bg-surface text-ink hover:bg-background'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Tab content */}
      {tab === 'overview' && (
        <>
          <KpiCards stats={stats} currency={currency} />
          <IncomeSection
            incomes={incomes}
            transactions={transactions}
            currency={currency}
            onAdd={() => setShowAddIncome(true)}
            onDelete={deleteIncome}
          />
          <SpendingOverview summaries={summaries} currency={currency} />
          <SpendingChart summaries={summaries} currency={currency} />
        </>
      )}

      {tab === 'budget' && (
        <>
          {budgetTypes.map((type) => (
            <BudgetSection
              key={type}
              type={type}
              categories={byType(type)}
              transactions={transactions}
              currency={currency}
              onAdd={() => setAddBudgetType(type)}
              onDelete={deleteCategory}
              onTogglePaid={togglePaid}
            />
          ))}
        </>
      )}

      {tab === 'transactions' && (
        <TransactionsSection
          transactions={transactions}
          categories={categories}
          currency={currency}
          onAdd={() => setShowAddTx(true)}
          onDelete={deleteTransaction}
        />
      )}

      {tab === 'daily' && <DailySection days={dailyData} currency={currency} />}

      {/* Modals */}
      <AddTransactionModal
        isOpen={showAddTx}
        onClose={() => setShowAddTx(false)}
        monthId={id}
        baseCurrency={currency}
        categories={categories}
        getRate={getRate}
        ratesLoading={ratesLoading}
        onAdd={addTransaction}
      />

      <AddIncomeModal
        isOpen={showAddIncome}
        onClose={() => setShowAddIncome(false)}
        monthId={id}
        onAdd={addIncome}
      />

      {addBudgetType && (
        <AddBudgetItemModal
          isOpen={true}
          onClose={() => setAddBudgetType(null)}
          type={addBudgetType}
          monthId={id}
          nextOrder={byType(addBudgetType).length}
          onAdd={addCategory}
        />
      )}
    </main>
  );
}
