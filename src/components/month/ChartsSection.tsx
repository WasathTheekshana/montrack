'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { fmt } from '@/lib/currency';
import { BUDGET_TYPE_CONFIG } from '@/lib/constants';
import type { BudgetSummary, DailySpending, CurrencyCode } from '@/types';

interface ChartsSectionProps {
  summaries: BudgetSummary[];
  dailyData: DailySpending[];
  currency: CurrencyCode;
}

const cardCls =
  'rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] p-4';

export function ChartsSection({ summaries, dailyData, currency }: ChartsSectionProps) {
  // Chart 1 — Spending Breakdown (Donut)
  const donutData = summaries
    .filter((s) => s.actual > 0)
    .map((s) => ({
      name: BUDGET_TYPE_CONFIG[s.type].label,
      value: s.actual,
      color: BUDGET_TYPE_CONFIG[s.type].hexColor,
    }));

  // Chart 2 — Budget vs Actual (Horizontal bar)
  const barData = summaries.map((s) => ({
    name: BUDGET_TYPE_CONFIG[s.type].label.split(' ')[0],
    Budget: s.budget,
    Actual: s.actual,
    color: BUDGET_TYPE_CONFIG[s.type].hexColor,
  }));

  // Chart 3 — Daily Balance (Area)
  const areaData = dailyData.map((d) => ({
    date: d.date,
    Balance: d.balance,
    label: format(parseISO(d.date), 'MMM d'),
  }));

  return (
    <div className="space-y-5 px-5 mt-5 pb-10">
      <h2 className="font-display font-bold text-base text-ink uppercase tracking-wider">
        Charts & Analysis
      </h2>

      {/* Chart 1 — Spending Breakdown */}
      <div className={cardCls}>
        <h3 className="font-display font-bold text-sm text-ink uppercase tracking-wider mb-3">
          Spending Breakdown
        </h3>
        {donutData.length === 0 ? (
          <div className="py-8 flex items-center justify-center">
            <p className="text-ink/40 text-sm font-semibold">No spending data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                stroke="#0A0A0A"
                strokeWidth={2}
              >
                {donutData.map((entry) => (
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
        )}
      </div>

      {/* Chart 2 — Budget vs Actual */}
      <div className={cardCls}>
        <h3 className="font-display font-bold text-sm text-ink uppercase tracking-wider mb-3">
          Budget vs Actual
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0A0A0A" strokeOpacity={0.08} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fontWeight: 700, fill: '#0A0A0A' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fontWeight: 700, fill: '#0A0A0A' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => fmt(v, currency).replace(/\.\d+$/, '')}
              width={60}
            />
            <Tooltip
              formatter={(value, name) => [fmt(Number(value), currency), String(name)]}
              contentStyle={{
                border: '2px solid #0A0A0A',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: 12,
              }}
            />
            <Bar dataKey="Budget" fill="#0A0A0A" fillOpacity={0.15} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Actual" radius={[4, 4, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 3 — Daily Balance */}
      <div className={cardCls}>
        <h3 className="font-display font-bold text-sm text-ink uppercase tracking-wider mb-3">
          Daily Balance
        </h3>
        {areaData.length === 0 ? (
          <div className="py-8 flex items-center justify-center">
            <p className="text-ink/40 text-sm font-semibold">No daily data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFE135" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#FFE135" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#0A0A0A" strokeOpacity={0.08} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fontWeight: 700, fill: '#0A0A0A' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fontWeight: 700, fill: '#0A0A0A' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => fmt(v, currency).replace(/\.\d+$/, '')}
                width={60}
              />
              <Tooltip
                formatter={(value) => [fmt(Number(value), currency), 'Balance']}
                labelFormatter={(label) => String(label)}
                contentStyle={{
                  border: '2px solid #0A0A0A',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="Balance"
                stroke="#0A0A0A"
                strokeWidth={2}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
