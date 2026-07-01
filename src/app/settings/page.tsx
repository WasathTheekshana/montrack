'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Gear, Heart, DownloadSimple, UploadSimple } from '@phosphor-icons/react';
import { useSettings } from '@/lib/hooks/useSettings';
import { useMonths } from '@/lib/hooks/useMonths';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import { PageLayout } from '@/components/layout/PageLayout';
import { Select } from '@/components/ui/Select';
import { exportBackup, importBackup, clearAllData } from '@/lib/backup';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const { months, refresh } = useMonths();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importState, setImportState] = useState<'idle' | 'confirm' | 'success' | 'error'>('idle');
  const [importError, setImportError] = useState('');
  const [importedMonths, setImportedMonths] = useState(0);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [deleteState, setDeleteState] = useState<'idle' | 'warn' | 'confirm'>('idle');

  const labelCls = 'block text-xs font-black text-ink/60 uppercase tracking-wider mb-1';

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setImportState('confirm');
    e.target.value = '';
  }

  async function handleConfirmImport() {
    if (!pendingFile) return;
    setImportState('idle');
    const result = await importBackup(pendingFile);
    if (result.ok) {
      setImportedMonths(result.monthCount);
      setImportState('success');
      refresh();
    } else {
      setImportError(result.error ?? 'Import failed.');
      setImportState('error');
    }
    setPendingFile(null);
  }

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

      <div className="border-t-2 border-ink/10 pt-4 mt-4 space-y-1">
        <button
          onClick={() => router.push('/')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
        >
          <ArrowLeft size={14} weight="bold" />
          Back to Home
        </button>
        <button
          onClick={() => router.push('/about')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
        >
          <Heart size={16} weight="bold" />
          About
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

        {/* Backup & Restore */}
        <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] p-5">
          <h2 className="font-display font-bold text-base text-ink mb-1">Backup & Restore</h2>
          <p className="text-xs text-ink/40 font-semibold mb-4">
            Export all your months, budgets, and transactions to a JSON file. Import it later to restore everything.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={exportBackup}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-ink bg-yellow font-bold text-sm text-ink [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:5px_5px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] transition-all"
            >
              <DownloadSimple size={16} weight="bold" />
              Export
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-ink bg-surface font-bold text-sm text-ink [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:5px_5px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] transition-all"
            >
              <UploadSimple size={16} weight="bold" />
              Import
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Confirm overwrite */}
          {importState === 'confirm' && (
            <div className="mt-4 rounded-xl border-2 border-ink bg-yellow/20 p-4">
              <p className="text-sm font-bold text-ink">
                This will overwrite all existing data with <span className="text-pink">{pendingFile?.name}</span>. Continue?
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleConfirmImport}
                  className="flex-1 py-2 rounded-lg border-2 border-ink bg-pink text-white text-sm font-black [box-shadow:2px_2px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                  Yes, restore
                </button>
                <button
                  onClick={() => { setImportState('idle'); setPendingFile(null); }}
                  className="flex-1 py-2 rounded-lg border-2 border-ink bg-surface text-ink text-sm font-black [box-shadow:2px_2px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {importState === 'success' && (
            <div className="mt-4 rounded-xl border-2 border-ink bg-lime/30 p-3">
              <p className="text-sm font-bold text-ink">
                ✓ Restored {importedMonths} month{importedMonths !== 1 ? 's' : ''} successfully.
              </p>
            </div>
          )}

          {importState === 'error' && (
            <div className="mt-4 rounded-xl border-2 border-ink bg-pink/20 p-3">
              <p className="text-sm font-bold text-ink">{importError}</p>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border-2 border-pink bg-surface [box-shadow:3px_3px_0_#FF2D78] p-5">
          <h2 className="font-display font-bold text-base text-pink mb-1">Danger Zone</h2>
          <p className="text-xs text-ink/40 font-semibold mb-4">
            Permanently deletes all months, budgets, transactions, and income entries from this device.
          </p>

          {deleteState === 'idle' && (
            <button
              onClick={() => setDeleteState('warn')}
              className="flex items-center gap-2 py-2.5 px-4 rounded-xl border-2 border-pink bg-pink/10 text-pink font-bold text-sm hover:bg-pink hover:text-white [box-shadow:2px_2px_0_#FF2D78] active:[box-shadow:0px_0px_0_#FF2D78] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Delete All Data
            </button>
          )}

          {deleteState === 'warn' && (
            <div className="rounded-xl border-2 border-pink bg-pink/5 p-4 space-y-3">
              <p className="text-sm font-bold text-ink">
                ⚠️ This will permanently erase <span className="text-pink">all your data</span> — months, budgets, transactions, and income. This cannot be undone.
              </p>
              <p className="text-xs font-bold text-ink/50">
                We recommend exporting a backup first before proceeding.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={exportBackup}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-lg border-2 border-ink bg-yellow text-ink text-xs font-black [box-shadow:2px_2px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                  <DownloadSimple size={13} weight="bold" />
                  Export backup first
                </button>
                <button
                  onClick={() => setDeleteState('confirm')}
                  className="py-2 px-3 rounded-lg border-2 border-pink text-pink text-xs font-black hover:bg-pink hover:text-white transition-all"
                >
                  Skip, delete now
                </button>
              </div>
              <button
                onClick={() => setDeleteState('idle')}
                className="text-xs font-bold text-ink/40 hover:text-ink transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {deleteState === 'confirm' && (
            <div className="rounded-xl border-2 border-pink bg-pink/10 p-4 space-y-3">
              <p className="text-sm font-black text-pink">
                Are you absolutely sure? Type to confirm below.
              </p>
              <p className="text-xs font-bold text-ink/50">
                This action is irreversible. All local data will be gone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    clearAllData();
                    refresh();
                    setDeleteState('idle');
                  }}
                  className="flex-1 py-2.5 rounded-xl border-2 border-pink bg-pink text-white text-sm font-black [box-shadow:3px_3px_0_#FF2D78] active:[box-shadow:0px_0px_0_#FF2D78] active:translate-x-[3px] active:translate-y-[3px] transition-all"
                >
                  Yes, delete everything
                </button>
                <button
                  onClick={() => setDeleteState('idle')}
                  className="px-4 py-2.5 rounded-xl border-2 border-ink bg-surface text-ink text-sm font-black [box-shadow:2px_2px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push('/about')}
          className="w-full text-left rounded-2xl border-2 border-ink bg-yellow [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:5px_5px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] transition-all p-5"
        >
          <h2 className="font-display font-bold text-base text-ink">About Montrack</h2>
          <p className="text-sm text-ink/60 font-semibold mt-1">
            Open-source personal finance tracker. All data is stored locally on your device.
          </p>
          <p className="text-xs text-ink/40 font-bold mt-3 uppercase tracking-wider">
            v0.1.0 · View about page →
          </p>
        </button>
      </div>
    </PageLayout>
  );
}
