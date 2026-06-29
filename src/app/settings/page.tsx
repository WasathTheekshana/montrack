'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from '@phosphor-icons/react';
import { useSettings } from '@/lib/hooks/useSettings';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();

  const inputCls =
    'w-full border-2 border-ink rounded-xl px-3 py-2.5 text-sm font-semibold text-ink bg-background focus:outline-none focus:ring-2 focus:ring-yellow [box-shadow:2px_2px_0_#0A0A0A]';
  const labelCls = 'block text-xs font-black text-ink/60 uppercase tracking-wider mb-1';

  return (
    <main className="max-w-md mx-auto min-h-screen bg-background">
      <header className="flex items-center gap-3 px-5 pt-14 pb-5 border-b-2 border-ink">
        <button
          onClick={() => router.push('/')}
          className="w-9 h-9 rounded-xl border-2 border-ink bg-surface [box-shadow:2px_2px_0_#0A0A0A] flex items-center justify-center hover:[box-shadow:4px_4px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <ArrowLeft size={16} weight="bold" className="text-ink" />
        </button>
        <h1 className="font-display font-bold text-xl text-ink">Settings</h1>
      </header>

      <div className="px-5 py-6 space-y-5">
        <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] p-5">
          <h2 className="font-display font-bold text-base text-ink mb-4">Currency</h2>
          <div>
            <label className={labelCls}>Default Base Currency</label>
            <select
              className={inputCls}
              value={settings.baseCurrency}
              onChange={(e) => updateSettings({ baseCurrency: e.target.value })}
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-ink/40 font-semibold">
              This is the default for new months. Each month can have its own base currency.
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
    </main>
  );
}
