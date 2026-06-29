export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface WalletStats {
  totalBalance: number;
  income: number;
  expenses: number;
  savings: number;
  changePercent: number;
}

