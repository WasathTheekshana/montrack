'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fmt } from '@/lib/currency';
import { BUDGET_TYPE_CONFIG } from '@/lib/constants';
import type { BudgetSummary, CurrencyCode } from '@/types';

interface SpendingChartProps {
  summaries: BudgetSummary[];
  currency: CurrencyCode;
}

export function SpendingChart({ summaries, currency }: SpendingChartProps) {
  const data = summaries
    .filter((s) => s.actual > 0)
    .map((s) => ({
      name: s.type.charAt(0).toUpperCase() + s.type.slice(1),
      value: s.actual,
      color: BUDGET_TYPE_CONFIG[s.type].hexColor,
    }));

  if (data.length === 0) {
    return (
      <div className="px-5 mt-5">
        <h2 className="font-display font-bold text-base text-ink uppercase tracking-wider mb-3">
          Where Money Goes
        </h2>
        <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] py-10 flex items-center justify-center">
          <p className="text-ink/40 text-sm font-semibold">No spending data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 mt-5">
      <h2 className="font-display font-bold text-base text-ink uppercase tracking-wider mb-3">
        Where Money Goes
      </h2>
      <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] p-4">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              stroke="#0A0A0A"
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [fmt(Number(value), currency), 'Spent']}
              contentStyle={{
                border: '2px solid #0A0A0A',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: 12,
              }}
            />
            <Legend
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0A0A0A' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
