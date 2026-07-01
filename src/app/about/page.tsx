'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GithubLogo, Gear, Code, Heart } from '@phosphor-icons/react';
import { useMonths } from '@/lib/hooks/useMonths';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

function DeveloperIllustration() {
  return (
    <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Card drop shadow */}
      <rect x="14" y="14" width="172" height="194" rx="22" fill="#0A0A0A" />

      {/* Ears — drawn before card so card covers inner edge */}
      <rect x="1" y="108" width="13" height="22" rx="6" fill="#FFE135" stroke="#0A0A0A" strokeWidth="3" />
      <rect x="186" y="108" width="13" height="22" rx="6" fill="#FFE135" stroke="#0A0A0A" strokeWidth="3" />

      {/* Face card */}
      <rect x="8" y="8" width="172" height="194" rx="22" fill="#FFE135" stroke="#0A0A0A" strokeWidth="4" />

      {/* Hair — rounded top matching card, flat bottom */}
      <rect x="8" y="8" width="172" height="92" rx="22" fill="#0A0A0A" />
      <rect x="8" y="74" width="172" height="26" fill="#0A0A0A" />

      {/* Glasses temples */}
      <line x1="36" y1="114" x2="14" y2="109" stroke="#0A0A0A" strokeWidth="4" strokeLinecap="round" />
      <line x1="164" y1="114" x2="186" y2="109" stroke="#0A0A0A" strokeWidth="4" strokeLinecap="round" />

      {/* Glasses left frame */}
      <rect x="30" y="100" width="62" height="42" rx="12" fill="white" fillOpacity="0.45" stroke="#0A0A0A" strokeWidth="4" />
      {/* Glasses right frame */}
      <rect x="108" y="100" width="62" height="42" rx="12" fill="white" fillOpacity="0.45" stroke="#0A0A0A" strokeWidth="4" />
      {/* Bridge */}
      <line x1="92" y1="121" x2="108" y2="121" stroke="#0A0A0A" strokeWidth="4" strokeLinecap="round" />

      {/* Pupils */}
      <circle cx="61" cy="121" r="10" fill="#0A0A0A" />
      <circle cx="139" cy="121" r="10" fill="#0A0A0A" />
      {/* Eye shine */}
      <circle cx="66" cy="116" r="3.5" fill="white" />
      <circle cx="144" cy="116" r="3.5" fill="white" />

      {/* Smile */}
      <path d="M 78 158 Q 100 176 122 158" stroke="#0A0A0A" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function AboutPage() {
  const router = useRouter();
  const { months } = useMonths();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <LoadingScreen />;

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
          onClick={() => router.push('/settings')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
        >
          <Gear size={16} weight="bold" />
          Settings
        </button>
        <button
          onClick={() => router.push('/about')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-ink bg-yellow/40 hover:bg-yellow/60 transition-colors"
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
        <h1 className="font-display font-bold text-xl text-ink">About</h1>
      </header>

      <div className="px-5 md:px-8 py-6 md:py-10 max-w-2xl space-y-5">

        {/* Hero card — illustration + name */}
        <div className="rounded-2xl border-2 border-ink bg-yellow [box-shadow:4px_4px_0_#0A0A0A] overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-0">
            {/* Illustration */}
            <div className="w-48 h-56 sm:w-52 sm:h-60 flex-shrink-0 px-4 pt-6 pb-2">
              <DeveloperIllustration />
            </div>
            {/* Info */}
            <div className="flex-1 px-6 pb-6 sm:py-6 text-left">
              <p className="text-[10px] font-black text-ink/50 uppercase tracking-widest mb-1">Creator</p>
              <h1 className="font-display font-bold text-3xl text-ink leading-tight">
                Wasath<br />Theekshana
              </h1>
              <p className="text-sm font-semibold text-ink/60 mt-2">
                Software Engineer & open-source enthusiast building tools that make everyday life simpler.
              </p>
              <a
                href="https://github.com/WasathTheekshana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl border-2 border-ink bg-ink text-surface text-sm font-black [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:5px_5px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] transition-all"
              >
                <GithubLogo size={18} weight="bold" />
                WasathTheekshana
              </a>
            </div>
          </div>
        </div>

        {/* About the project */}
        <div className="rounded-2xl border-2 border-ink bg-surface [box-shadow:3px_3px_0_#0A0A0A] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Code size={18} weight="bold" className="text-ink" />
            <h2 className="font-display font-bold text-base text-ink uppercase tracking-wider">About Montrack</h2>
          </div>
          <p className="text-sm font-semibold text-ink/70 leading-relaxed">
            Montrack is an open-source personal finance tracker built as a Progressive Web App. It helps you manage monthly budgets across multiple currencies, track bills, expenses, savings, and debt — all stored privately on your device with no account required.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {['Next.js 16', 'TypeScript', 'Tailwind v4', 'PWA', 'LocalStorage'].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg border-2 border-ink bg-background text-xs font-black text-ink"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Open source */}
        <div className="rounded-2xl border-2 border-ink bg-lime [box-shadow:3px_3px_0_#0A0A0A] p-5">
          <div className="flex items-center gap-2 mb-1">
            <Heart size={16} weight="bold" className="text-ink" />
            <h2 className="font-display font-bold text-base text-ink">Open Source</h2>
          </div>
          <p className="text-sm font-semibold text-ink/70 mt-1">
            Montrack is free and open source. Contributions, feedback, and feature requests are welcome on GitHub.
          </p>
          <p className="text-xs font-black text-ink/40 uppercase tracking-wider mt-3">v0.1.0 · All data stays on your device</p>
        </div>

      </div>
    </PageLayout>
  );
}
