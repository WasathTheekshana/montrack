'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Gear } from '@phosphor-icons/react';
import { useSettings } from '@/lib/hooks/useSettings';
import { useMonths } from '@/lib/hooks/useMonths';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import { PageLayout } from '@/components/layout/PageLayout';
import { Select } from '@/components/ui/Select';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const { months } = useMonths();

  const labelCls = 'block text-xs font-black text-ink/60 uppercase tracking-wider mb-1';

  const sidebar = (
    <div className="flex flex-col h-full p-5">
      <div className="pt-8 pb-5 flex items-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="w-8 h-8 rounded-lg border-2 border-ink bg-background flex items-center justify-center [box-shadow:2px_2px_0_#0A0A0A] hover:[box-shadow:3px_3px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] transition-all"
        >
          <ArrowLeft size={14} weight="bold" className="text-ink" />
        </button>
        <span className="font-display font-bold text-xl text-ink">Montrack</span>
      </div>

      <div className="border-t-2 border-ink/10 pt-4 flex-1 overflow-y-auto">
        <p className="text-[10px] font-black text-ink/40 uppercase tracking-wider mb-2 px-1">Months</p>
        {months.length === 0 ? (
          <p className="text-xs text-ink/30 font-semibold px-1">No months yet</p>
        ) : (
          <div className="space-y-1">
            {months.map((month) => (
              <button
                key={month.id}
                onClick={() => router.push(`/months/${month.id}`)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-ink hover:bg-ink/5 transition-colors truncate"
              >
                {month.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t-2 border-ink/10 pt-4 mt-4">
        <button
          onClick={() => router.push('/')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
        >
          <ArrowLeft size={14} weight="bold" />
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <PageLayout sidebar={sidebar}>
      {/* Mobile header */}
      <header className="md:hidden flex items-center gap-3 px-5 pt-14 pb-5 border-b-2 border-ink">
        <button
          onClick={() => router.push('/')}
          className="w-9 h-9 rounded-xl border-2 border-ink bg-surface [box-shadow:2px_2px_0_#0A0A0A] flex items-center justify-center hover:[box-shadow:4px_4px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <ArrowLeft size={16} weight="bold" className="text-ink" />
        </button>
        <h1 className="font-display font-bold text-xl text-ink">Settings</h1>
      </header>

      {/* Desktop header */}
      <div className="hidden md:flex items-center gap-3 px-8 pt-10 pb-6 border-b-2 border-ink">
        <Gear size={24} weight="bold" className="text-ink" />
        <h1 className="font-display font-bold text-3xl text-ink">Settings</h1>
      </div>

      <div className="px-5 md:px-8 py-6 space-y-5 max-w-2xl">
        <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] p-5">
          <h2 className="font-display font-bold text-base text-ink mb-4">Currency</h2>
          <div>
            <label className={labelCls}>Default Base Currency</label>
            <Select
              value={settings.baseCurrency}
              onChange={(e) => updateSettings({ baseCurrency: e.target.value })}
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </Select>
            <p className="mt-2 text-xs text-ink/40 font-semibold">
              Default for new months. Each month can have its own base currency.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-ink bg-yellow [box-shadow:3px_3px_0_#0A0A0A] p-5">
          <h2 className="font-display font-bold text-base text-ink">About Montrack</h2>
          <p className="text-sm text-ink/60 font-semibold mt-1">
            Open-source personal finance tracker. All data is stored locally on your device.
          </p>
          <p className="text-xs text-ink/40 font-bold mt-3 uppercase tracking-wider">
            v0.1.0 · Local Storage
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
