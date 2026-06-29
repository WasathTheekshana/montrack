import type { BudgetType } from '@/types';

export const BUDGET_TYPE_CONFIG: Record<
  BudgetType,
  { label: string; bgClass: string; hexColor: string; textClass: string }
> = {
  bills: {
    label: 'Bills & Subscriptions',
    bgClass: 'bg-orange',
    textClass: 'text-orange',
    hexColor: '#FF6B1A',
  },
  expenses: {
    label: 'Expenses',
    bgClass: 'bg-pink',
    textClass: 'text-pink',
    hexColor: '#FF2D78',
  },
  savings: {
    label: 'Savings',
    bgClass: 'bg-lime',
    textClass: 'text-lime',
    hexColor: '#ADFF2F',
  },
  debt: {
    label: 'Debt',
    bgClass: 'bg-yellow',
    textClass: 'text-ink',
    hexColor: '#FFE135',
  },
};

// Default template categories for new months
export const DEFAULT_TEMPLATE: Record<
  BudgetType,
  Array<{ name: string; budgetAmount: number; dueDate?: string }>
> = {
  bills: [
    { name: 'BL - Mobile', budgetAmount: 0 },
    { name: 'BL - Internet', budgetAmount: 0 },
    { name: 'SUBS - Netflix', budgetAmount: 0 },
    { name: 'SUBS - YouTube Premium', budgetAmount: 0 },
  ],
  expenses: [
    { name: 'EX - Groceries', budgetAmount: 0 },
    { name: 'EX - Eat Out & Day Out', budgetAmount: 0 },
    { name: 'EX - Transport', budgetAmount: 0 },
    { name: 'EX - Shopping', budgetAmount: 0 },
    { name: 'EX - Misc', budgetAmount: 0 },
  ],
  savings: [
    { name: 'SV - General Savings', budgetAmount: 0 },
    { name: 'SV - Emergency Fund', budgetAmount: 0 },
  ],
  debt: [{ name: 'DB - Credit Card', budgetAmount: 0 }],
};
