import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TransactionList } from '@/components/dashboard/TransactionList';
import type { WalletStats, Transaction } from '@/types';

const mockStats: WalletStats = {
  totalBalance: 12485.5,
  income: 4200.0,
  expenses: 1850.0,
  savings: 2350.0,
  changePercent: 2.4,
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: 94.5,
    type: 'expense',
    category: 'Food',
    date: '2026-06-28',
  },
  {
    id: '2',
    title: 'Monthly Salary',
    amount: 3200.0,
    type: 'income',
    category: 'Salary',
    date: '2026-06-27',
  },
  {
    id: '3',
    title: 'Apartment Rent',
    amount: 1200.0,
    type: 'expense',
    category: 'Housing',
    date: '2026-06-25',
  },
  {
    id: '4',
    title: 'Netflix Subscription',
    amount: 15.99,
    type: 'expense',
    category: 'Entertainment',
    date: '2026-06-24',
  },
  {
    id: '5',
    title: 'Freelance Project',
    amount: 750.0,
    type: 'income',
    category: 'Freelance',
    date: '2026-06-23',
  },
  {
    id: '6',
    title: 'Coffee Shop',
    amount: 6.5,
    type: 'expense',
    category: 'Food',
    date: '2026-06-22',
  },
];

export default function DashboardPage() {
  return (
    <main className="relative max-w-md mx-auto min-h-screen bg-background">
      <Header />
      <BalanceCard stats={mockStats} />
      <StatsRow stats={mockStats} />
      <QuickActions />
      <TransactionList transactions={mockTransactions} />
      <BottomNav />
    </main>
  );
}
