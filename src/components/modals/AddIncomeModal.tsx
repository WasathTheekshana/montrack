'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Modal } from './Modal';
import { NumberInput } from '@/components/ui/NumberInput';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthId: string;
  onAdd: (data: {
    monthId: string;
    name: string;
    payday: string;
    startDay: string;
    expectedAmount: number;
  }) => void;
}

export function AddIncomeModal({ isOpen, onClose, monthId, onAdd }: AddIncomeModalProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [name, setName] = useState('');
  const [payday, setPayday] = useState(today);
  const [startDay, setStartDay] = useState(today);
  const [expectedAmount, setExpectedAmount] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      monthId,
      name,
      payday,
      startDay,
      expectedAmount: parseFloat(expectedAmount) || 0,
    });
    setName('');
    setExpectedAmount('');
    onClose();
  }

  const inputCls =
    'w-full border-2 border-ink rounded-xl px-3 py-2.5 text-sm font-semibold text-ink bg-background focus:outline-none focus:ring-2 focus:ring-yellow [box-shadow:2px_2px_0_#0A0A0A]';
  const labelCls = 'block text-xs font-black text-ink/60 uppercase tracking-wider mb-1';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Income Source">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Income Name</label>
          <input
            className={inputCls}
            placeholder="e.g. Paycheck - June"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Payday</label>
            <input type="date" className={inputCls} value={payday} onChange={(e) => setPayday(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Start Day</label>
            <input type="date" className={inputCls} value={startDay} onChange={(e) => setStartDay(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Expected Amount</label>
          <NumberInput
            placeholder="0.00"
            className={inputCls}
            value={expectedAmount}
            onChange={setExpectedAmount}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl border-2 border-ink bg-lime font-display font-bold text-ink [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:5px_5px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] transition-all"
        >
          Add Income
        </button>
      </form>
    </Modal>
  );
}
