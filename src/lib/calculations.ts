import { eachDayOfInterval, parseISO, format, isSameDay } from 'date-fns';
import type {
  Transaction,
  Income,
  BudgetCategory,
  BudgetSummary,
  DailySpending,
  MonthStats,
  BudgetType,
} from '@/types';

export function actualForCategory(
  categoryId: string,
  transactions: Transaction[]
): number {
  return transactions
    .filter((t) => t.budgetCategoryId === categoryId && t.type === 'expense')
    .reduce((s, t) => s + t.convertedAmount, 0);
}

export function actualIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.convertedAmount, 0);
}

export function budgetSummaries(
  categories: BudgetCategory[],
  transactions: Transaction[]
): BudgetSummary[] {
  const types: BudgetType[] = ['bills', 'expenses', 'savings', 'debt'];
  return types.map((type) => {
    const cats = categories.filter((c) => c.type === type);
    const budget = cats.reduce((s, c) => s + c.budgetAmount, 0);
    const actual = cats.reduce(
      (s, c) => s + actualForCategory(c.id, transactions),
      0
    );
    return { type, budget, actual, diff: budget - actual };
  });
}

export function monthStats(
  incomes: Income[],
  categories: BudgetCategory[],
  transactions: Transaction[]
): MonthStats {
  const expectedIncome = incomes.reduce((s, i) => s + i.expectedAmount, 0);
  const realIncome = actualIncome(transactions);
  const totalIncome = realIncome > 0 ? realIncome : expectedIncome;
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.convertedAmount, 0);
  const totalBudget = categories.reduce((s, c) => s + c.budgetAmount, 0);

  return {
    totalIncome,
    totalExpenses,
    totalBudget,
    leftToSpend: totalIncome - totalExpenses,
    leftToBudget: totalIncome - totalBudget,
  };
}

export function dailySpendings(
  startDate: string,
  endDate: string,
  transactions: Transaction[],
  openingBalance = 0
): DailySpending[] {
  const days = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  });

  let balance = openingBalance;
  return days.map((day) => {
    const txs = transactions.filter((t) =>
      isSameDay(parseISO(t.date), day)
    );
    const spent = txs
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.convertedAmount, 0);
    const income = txs
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.convertedAmount, 0);
    balance = balance + income - spent;
    return { date: format(day, 'yyyy-MM-dd'), spent, income, balance };
  });
}
