'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { storage, KEYS } from '../storage/adapter';

export interface NotificationSettings {
  enabled: boolean;
  reminderTime: string; // "HH:mm"
  lastFired: string;    // "yyyy-MM-dd"
}

const DEFAULTS: NotificationSettings = {
  enabled: false,
  reminderTime: '20:00',
  lastFired: '',
};

function supported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

// Direct notification — must be called synchronously within a user gesture
function fireImmediate(title: string, body: string): void {
  try {
    new Notification(title, { body, icon: '/icons/icon-192.svg' });
  } catch (e) {
    console.warn('[notifications] direct Notification failed:', e);
  }
}

// SW notification — works in background, no gesture requirement
async function fireViaSW(title: string, body: string): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, {
      body,
      icon: '/icons/icon-192.svg',
      badge: '/icons/icon-192.svg',
      tag: 'montrack-reminder',
    });
  } catch (e) {
    console.warn('[notifications] SW notification failed:', e);
  }
}

const REMINDER_MESSAGES = [
  "Your wallet called. It wants to know where the money went.",
  "Logging takes 30 seconds. Forgetting costs more.",
  "Future you will thank present you for logging today.",
  "Money doesn't manage itself — but you do.",
  "Quick check-in time. What did you spend today?",
  "A budget without transactions is just a wish. Log them.",
  "You tracked yesterday. Don't break the streak.",
  "Small logs, big picture. Add today's transactions.",
  "Every cent deserves to be counted. Log it.",
  "Be the CFO of your own life. Log today's expenses.",
  "Mindful spending starts with mindful logging.",
  "Your budget is rooting for you. Give it some data.",
];

function randomMessage(): string {
  return REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function currentTimeStr(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULTS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!supported()) return;
    setPermission(Notification.permission);
    const saved = storage.get<NotificationSettings>(KEYS.notifications);
    if (saved) setSettings(saved);
  }, []);

  // Minute tick — checks if it's time to fire the daily reminder
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!settings.enabled || permission !== 'granted') return;

    intervalRef.current = setInterval(() => {
      const s = storage.get<NotificationSettings>(KEYS.notifications) ?? settings;
      if (!s.enabled) return;

      const today = todayStr();
      const now = currentTimeStr();

      if (now === s.reminderTime && s.lastFired !== today) {
        fireViaSW('Montrack', randomMessage());
        const updated = { ...s, lastFired: today };
        storage.set(KEYS.notifications, updated);
        setSettings(updated);
      }
    }, 60_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [settings.enabled, settings.reminderTime, permission]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!supported()) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  // Read permission live — avoids stale closure after just granting
  // Call fireImmediate synchronously so the user gesture chain is intact
  const sendTest = useCallback((): boolean => {
    if (!supported()) return false;
    const current = Notification.permission;
    if (current !== 'granted') {
      setPermission(current);
      return false;
    }
    fireImmediate('Montrack Test', 'Notifications are working correctly!');
    return true;
  }, []);

  const updateSettings = useCallback((patch: Partial<NotificationSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      storage.set(KEYS.notifications, next);
      return next;
    });
  }, []);

  return {
    supported: supported(),
    permission,
    settings,
    requestPermission,
    sendTest,
    updateSettings,
  };
}
