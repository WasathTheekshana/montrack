import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Month',
  robots: { index: false, follow: false },
};

export default function MonthsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
