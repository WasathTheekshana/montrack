'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Modal } from './Modal';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CategorySelect } from '@/components/ui/CategorySelect';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import type { BudgetCategory, CurrencyCode } from '@/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthId: string;
  baseCurrency: CurrencyCode;
  categories: BudgetCategory[];
  getRate: (from: CurrencyCode) => number;
  ratesLoading: boolean;
  onAdd: (data: {
    date: string;
    originalAmount: number;
    currency: CurrencyCode;
    exchangeRate: number;
    convertedAmount: number;
    budgetCategoryId: string;
    description: string;
    type: 'expense' | 'income';
    monthId: string;
  }) => void;
}

export function AddTransactionModal({
  isOpen,
  onClose,
  monthId,
  baseCurrency,
  categories,
  getRate,
  ratesLoading,
  onAdd,
}: AddTransactionModalProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(baseCurrency);
  const [exchangeRate, setExchangeRate] = useState('1');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');

  const isForeignCurrency = currency !== baseCurrency;

  // Re-fetch rate when currency or date changes
  useEffect(() => {
    const rate = getRate(currency);
    setExchangeRate(rate.toFixed(4));
  }, [currency, date, getRate]);

  const converted = parseFloat(amount || '0') * parseFloat(exchangeRate || '1');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const originalAmount = parseFloat(amount);
    const rate = parseFloat(exchangeRate);
    onAdd({
      monthId,
      date,
      originalAmount,
      currency,
      exchangeRate: rate,
      convertedAmount: originalAmount * rate,
      budgetCategoryId: type === 'income' ? '' : categoryId,
      description,
      type,
    });
    // Reset
    setAmount('');
    setDescription('');
    setCategoryId('');
    onClose();
  }

  const inputCls =
    'w-full border-2 border-ink rounded-xl px-3 py-2.5 text-sm font-semibold text-ink bg-background focus:outline-none focus:ring-2 focus:ring-yellow [box-shadow:2px_2px_0_#0A0A0A]';
  const labelCls = 'block text-xs font-black text-ink/60 uppercase tracking-wider mb-1';

  const expenseCategories = categories.filter((c) =>
    ['bills', 'expenses', 'savings', 'debt'].includes(c.type)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div className="grid grid-cols-2 gap-2">
          {(['expense', 'income'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-2.5 rounded-xl border-2 border-ink text-sm font-black capitalize transition-all [box-shadow:2px_2px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] ${
                type === t
                  ? t === 'income'
                    ? 'bg-lime text-ink'
                    : 'bg-pink text-white'
                  : 'bg-surface text-ink hover:bg-background'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <label className={labelCls}>Date</label>
          <input
            type="date"
            className={inputCls}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Amount</label>
            <NumberInput
              placeholder="0.00"
              className={inputCls}
              value={amount}
              onChange={setAmount}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Currency</label>
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {isForeignCurrency && (
          <div>
            <label className={labelCls}>
              Exchange Rate (1 {currency} = ? {baseCurrency})
              {ratesLoading && <span className="ml-1 text-ink/40">fetching…</span>}
            </label>
            <input
              type="number"
              step="0.0001"
              min="0"
              className={inputCls}
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              required
            />
            {amount && (
              <p className="mt-1 text-xs text-ink/50 font-semibold">
                ≈ {baseCurrency} {converted.toFixed(2)}
              </p>
            )}
            <p className="mt-1 text-xs text-orange font-bold">
              Rate is for today. Adjust manually if this is a past transaction.
            </p>
          </div>
        )}

        {type === 'expense' && (
          <div>
            <label className={labelCls}>Budget Category</label>
            <CategorySelect
              categories={expenseCategories}
              value={categoryId}
              onChange={setCategoryId}
              placeholder="Select category…"
              required
            />
          </div>
        )}

        <div>
          <label className={labelCls}>Description</label>
          <input
            className={inputCls}
            placeholder="e.g. Monthly subscription payment"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-xl border-2 border-ink font-display font-bold [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:5px_5px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] transition-all ${
            type === 'income' ? 'bg-lime text-ink' : 'bg-yellow text-ink'
          }`}
        >
          Add {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </Modal>
  );
}
