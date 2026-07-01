import { storage, KEYS } from './storage/adapter';
import { monthRepository } from './repositories/monthRepository';
import { incomeRepository } from './repositories/incomeRepository';
import { budgetRepository } from './repositories/budgetRepository';
import { transactionRepository } from './repositories/transactionRepository';
import type { Month, Income, BudgetCategory, Transaction, AppSettings } from '@/types';
import type { NotificationSettings } from './hooks/useNotifications';

export interface BackupData {
  version: number;
  exportedAt: string;
  months: Month[];
  settings: AppSettings | null;
  notificationSettings: NotificationSettings | null;
  income: Record<string, Income[]>;
  budget: Record<string, BudgetCategory[]>;
  transactions: Record<string, Transaction[]>;
}

export function exportBackup(): void {
  const months = monthRepository.findAll();

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    months,
    settings: storage.get<AppSettings>(KEYS.settings),
    notificationSettings: storage.get<NotificationSettings>(KEYS.notifications),
    income: Object.fromEntries(months.map((m) => [m.id, incomeRepository.findByMonth(m.id)])),
    budget: Object.fromEntries(months.map((m) => [m.id, budgetRepository.findByMonth(m.id)])),
    transactions: Object.fromEntries(months.map((m) => [m.id, transactionRepository.findByMonth(m.id)])),
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `montrack-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function clearAllData(): void {
  const months = monthRepository.findAll();
  for (const month of months) {
    storage.remove(KEYS.income(month.id));
    storage.remove(KEYS.budget(month.id));
    storage.remove(KEYS.transactions(month.id));
  }
  storage.remove(KEYS.months);
  storage.remove(KEYS.settings);
  storage.remove(KEYS.notifications);
}

export function importBackup(file: File): Promise<{ ok: boolean; error?: string; monthCount: number }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const raw = e.target?.result as string;
        const data = JSON.parse(raw) as BackupData;

        if (!data.version || !Array.isArray(data.months)) {
          resolve({ ok: false, error: 'Invalid backup file format.', monthCount: 0 });
          return;
        }

        // Restore months
        storage.set(KEYS.months, data.months);

        // Restore settings
        if (data.settings) {
          storage.set(KEYS.settings, data.settings);
        }

        // Restore notification settings
        if (data.notificationSettings) {
          storage.set(KEYS.notifications, data.notificationSettings);
        }

        // Restore per-month data
        for (const month of data.months) {
          if (data.income?.[month.id]) {
            storage.set(KEYS.income(month.id), data.income[month.id]);
          }
          if (data.budget?.[month.id]) {
            storage.set(KEYS.budget(month.id), data.budget[month.id]);
          }
          if (data.transactions?.[month.id]) {
            storage.set(KEYS.transactions(month.id), data.transactions[month.id]);
          }
        }

        resolve({ ok: true, monthCount: data.months.length });
      } catch {
        resolve({ ok: false, error: 'Could not parse backup file.', monthCount: 0 });
      }
    };

    reader.onerror = () => resolve({ ok: false, error: 'Failed to read file.', monthCount: 0 });
    reader.readAsText(file);
  });
}
