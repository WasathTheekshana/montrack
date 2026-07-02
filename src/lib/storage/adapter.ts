const PREFIX = 'montrack:';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export const storage = {
  get<T>(key: string): T | null {
    if (!isClient()) return null;
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isClient()) return;
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('[storage] write failed:', e);
    }
  },

  remove(key: string): void {
    if (!isClient()) return;
    localStorage.removeItem(PREFIX + key);
  },
};

export const KEYS = {
  months: 'months',
  settings: 'settings',
  notifications: 'notifications',
  tourCompleted: 'tour_completed',
  income: (monthId: string) => `income:${monthId}`,
  budget: (monthId: string) => `budget:${monthId}`,
  transactions: (monthId: string) => `transactions:${monthId}`,
  rates: (base: string) => `rates:${base}`,
} as const;
