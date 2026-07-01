import type { Metadata, Viewport } from 'next';
import { spaceGrotesk, dmSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'personal finance tracker',
    'budget tracker',
    'money tracker',
    'expense tracker',
    'PWA finance app',
    'open source budget',
    'multi-currency budget',
    'offline finance tracker',
    'local finance app',
    'monthly budget planner',
  ],
  authors: [{ name: 'Wasath Theekshana', url: 'https://github.com/WasathTheekshana' }],
  creator: 'Wasath Theekshana',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Personal Finance Tracker`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ['/opengraph-image'],
    creator: '@WasathTheekshana',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteConfig.name,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#FFE135',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full bg-background text-ink overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
