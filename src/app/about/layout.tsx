import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Montrack — an open-source personal finance PWA built by Wasath Theekshana.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About — Montrack',
    description: 'Learn about Montrack — an open-source personal finance PWA built by Wasath Theekshana.',
    url: '/about',
  },
  twitter: {
    title: 'About — Montrack',
    description: 'Learn about Montrack — an open-source personal finance PWA built by Wasath Theekshana.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
