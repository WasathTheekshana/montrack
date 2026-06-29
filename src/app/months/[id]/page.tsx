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
import { ChartsSection } from '@/components/month/ChartsSection';
import { PageLayout } from '@/components/layout/PageLayout';
import { AddTransactionModal } from '@/components/modals/AddTransactionModal';
import { AddBudgetItemModal } from '@/components/modals/AddBudgetItemModal';
import { AddIncomeModal } from '@/components/modals/AddIncomeModal';
import { cn } from '@/lib/utils';
import type { BudgetType } from '@/types';

type Tab = 'overview' | 'budget' | 'transactions' | 'daily' | 'charts';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'budget', label: 'Budget' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'daily', label: 'Daily' },
  { id: 'charts', label: 'Charts' },
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
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-sm font-bold text-ink underline"
          >
            Go home
          </button>
        </div>
      </main>
    );
  }

  const budgetTypes: BudgetType[] = ['bills', 'expenses', 'savings', 'debt'];

  const sidebar = (
    <div className="flex flex-col h-full p-5">
      <div className="pt-8 pb-5 flex items-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="w-8 h-8 rounded-lg border-2 border-ink bg-background flex items-center justify-center [box-shadow:2px_2px_0_#0A0A0A] hover:[box-shadow:3px_3px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] transition-all"
        >
          <ArrowLeft size={14} weight="bold" className="text-ink" />
        </button>
        <span className="font-display font-bold text-xl text-ink">Montrack</span>
      </div>

      <div className="border-t-2 border-ink/10 pt-5 pb-4">
        <h2 className="font-display font-bold text-2xl text-ink leading-tight">
          {month.name}
        </h2>
        <p className="text-ink/40 text-xs font-semibold mt-1">
          {format(parseISO(month.startDate), 'MMM d')} –{' '}
          {format(parseISO(month.endDate), 'MMM d, yyyy')}
        </p>
        <span className="inline-block mt-2 px-2 py-0.5 rounded-lg border-2 border-ink bg-yellow text-xs font-black text-ink">
          {currency}
        </span>
      </div>

      <div className="border-t-2 border-ink/10 pt-4 flex-1">
        <p className="text-[10px] font-black text-ink/40 uppercase tracking-wider mb-2 px-1">
          Navigate
        </p>
        <div className="space-y-1">
          {TABS.map(({ id: tabId, label }) => (
            <button
              key={tabId}
              onClick={() => setTab(tabId)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold border-2 transition-all',
                tab === tabId
                  ? 'bg-ink text-surface border-ink [box-shadow:2px_2px_0_#0A0A0A]'
                  : 'bg-transparent text-ink border-transparent hover:bg-ink/5 hover:border-ink/10'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-ink/10 pt-4 mt-4">
        <button
          onClick={() => setShowAddTx(true)}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-ink bg-yellow font-display font-bold text-sm text-ink [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:5px_5px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] transition-all"
        >
          <Plus size={16} weight="bold" />
          Add Transaction
        </button>
      </div>
    </div>
  );

  return (
    <PageLayout sidebar={sidebar}>
      {/* Mobile header — hidden on desktop */}
      <header className="md:hidden sticky top-0 z-30 bg-background border-b-2 border-ink px-5 pt-12 pb-3">
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
      <div className="pb-24 md:pb-10">
        {tab === 'overview' && (
          <>
            <div className="md:px-8 md:pt-8">
              <KpiCards stats={stats} currency={currency} />
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-6 md:px-8 md:mt-4">
              <div>
                <IncomeSection
                  incomes={incomes}
                  transactions={transactions}
                  currency={currency}
                  onAdd={() => setShowAddIncome(true)}
                  onDelete={deleteIncome}
                />
                <SpendingOverview summaries={summaries} currency={currency} />
              </div>
              <div className="hidden md:block">
                <ChartsSection
                  summaries={summaries}
                  dailyData={dailyData}
                  currency={currency}
                />
              </div>
            </div>
          </>
        )}

        {tab === 'budget' && (
          <>
            <div className="md:hidden">
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
            </div>
            <div className="hidden md:grid md:grid-cols-2 md:gap-6 md:px-8 md:pt-8">
              <div>
                {(['bills', 'expenses'] as BudgetType[]).map((type) => (
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
              </div>
              <div>
                {(['savings', 'debt'] as BudgetType[]).map((type) => (
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
              </div>
            </div>
          </>
        )}

        {tab === 'transactions' && (
          <div className="md:px-8 md:pt-8">
            <TransactionsSection
              transactions={transactions}
              categories={categories}
              currency={currency}
              onAdd={() => setShowAddTx(true)}
              onDelete={deleteTransaction}
            />
          </div>
        )}

        {tab === 'daily' && (
          <div className="md:px-8 md:pt-8">
            <DailySection days={dailyData} currency={currency} />
          </div>
        )}

        {tab === 'charts' && (
          <div className="md:px-8 md:pt-8">
            <ChartsSection
              summaries={summaries}
              dailyData={dailyData}
              currency={currency}
            />
          </div>
        )}
      </div>

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
    </PageLayout>
  );
}
