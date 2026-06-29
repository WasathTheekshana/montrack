'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Modal } from './Modal';
import { budgetRepository } from '@/lib/repositories/budgetRepository';
import { incomeRepository } from '@/lib/repositories/incomeRepository';
import { DEFAULT_TEMPLATE } from '@/lib/constants';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import type { Month, BudgetType } from '@/types';

type SetupMode = 'empty' | 'template' | 'copy';

interface CreateMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingMonths: Month[];
  onCreate: (data: Omit<Month, 'id' | 'createdAt'>) => Month;
  onCreated: (month: Month) => void;
}

export function CreateMonthModal({
  isOpen,
  onClose,
  existingMonths,
  onCreate,
  onCreated,
}: CreateMonthModalProps) {
  const today = new Date();
  const [name, setName] = useState(format(today, 'MMMM yyyy'));
  const [startDate, setStartDate] = useState(format(startOfMonth(today), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(today), 'yyyy-MM-dd'));
  const [baseCurrency, setBaseCurrency] = useState('LKR');
  const [setupMode, setSetupMode] = useState<SetupMode>('template');
  const [copyFromId, setCopyFromId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const month = onCreate({ name, startDate, endDate, baseCurrency });

    if (setupMode === 'template') {
      const types: BudgetType[] = ['bills', 'expenses', 'savings', 'debt'];
      let order = 0;
      types.forEach((type) => {
        DEFAULT_TEMPLATE[type].forEach((item) => {
          budgetRepository.save({
            id: crypto.randomUUID(),
            monthId: month.id,
            type,
            name: item.name,
            budgetAmount: item.budgetAmount,
            order: order++,
            isPaid: false,
          });
        });
      });
    } else if (setupMode === 'copy' && copyFromId) {
      const srcCats = budgetRepository.findByMonth(copyFromId);
      srcCats.forEach((cat) => {
        budgetRepository.save({ ...cat, id: crypto.randomUUID(), monthId: month.id, isPaid: false });
      });
      const srcIncomes = incomeRepository.findByMonth(copyFromId);
      srcIncomes.forEach((income) => {
        incomeRepository.save({ ...income, id: crypto.randomUUID(), monthId: month.id });
      });
    }

    onCreated(month);
    onClose();
  }

  const inputCls =
    'w-full border-2 border-ink rounded-xl px-3 py-2.5 text-sm font-semibold text-ink bg-background focus:outline-none focus:ring-2 focus:ring-yellow [box-shadow:2px_2px_0_#0A0A0A]';
  const labelCls = 'block text-xs font-black text-ink/60 uppercase tracking-wider mb-1';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Month">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Month Name</label>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Start Date</label>
            <input type="date" className={inputCls} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>End Date</label>
            <input type="date" className={inputCls} value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className={labelCls}>Base Currency</label>
          <select className={inputCls} value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Setup Budget Categories</label>
          <div className="grid grid-cols-3 gap-2">
            {(['empty', 'template', 'copy'] as SetupMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSetupMode(mode)}
                className={`py-2 rounded-xl border-2 border-ink text-xs font-black capitalize transition-all [box-shadow:2px_2px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] ${
                  setupMode === mode ? 'bg-yellow' : 'bg-surface hover:bg-background'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {setupMode === 'copy' && (
          <div>
            <label className={labelCls}>Copy From</label>
            <select
              className={inputCls}
              value={copyFromId}
              onChange={(e) => setCopyFromId(e.target.value)}
              required={setupMode === 'copy'}
            >
              <option value="">Select a month…</option>
              {existingMonths.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-xl border-2 border-ink bg-yellow font-display font-bold text-ink [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:5px_5px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] transition-all"
        >
          Create Month
        </button>
      </form>
    </Modal>
  );
}
