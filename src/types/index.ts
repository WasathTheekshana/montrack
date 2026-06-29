export type BudgetType = 'bills' | 'expenses' | 'savings' | 'debt';
export type TransactionType = 'expense' | 'income';
export type CurrencyCode = string;

export interface Month {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  baseCurrency: CurrencyCode;
  createdAt: string;
}

export interface Income {
  id: string;
  monthId: string;
  name: string;
  payday: string;
  startDay: string;
  expectedAmount: number;
}

export interface BudgetCategory {
  id: string;
  monthId: string;
  type: BudgetType;
  name: string;
  budgetAmount: number;
  description?: string;
  dueDate?: string;
  isPaid?: boolean;
  order: number;
}

export interface Transaction {
  id: string;
  monthId: string;
  date: string;
  originalAmount: number;
  currency: CurrencyCode;
  exchangeRate: number;
  convertedAmount: number;
  budgetCategoryId: string;
  description: string;
  type: TransactionType;
  createdAt: string;
}

export interface AppSettings {
  baseCurrency: CurrencyCode;
}

export interface ExchangeRateCache {
  base: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  fetchedAt: string;
  expiresAt: string;
}

export interface SupportedCurrency {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export interface BudgetSummary {
  type: BudgetType;
  budget: number;
  actual: number;
  diff: number;
}

export interface DailySpending {
  date: string;
  spent: number;
  income: number;
  balance: number;
}

export interface MonthStats {
  totalIncome: number;
  totalExpenses: number;
  totalBudget: number;
  leftToSpend: number;
  leftToBudget: number;
}
