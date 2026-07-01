'use client';

export function LoadingScreen() {
  return (
    <div
      suppressHydrationWarning
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      style={{
        backgroundImage: `
          linear-gradient(rgba(10,10,10,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(10,10,10,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '28px 28px',
      }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Logo mark */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl border-2 border-ink bg-yellow [box-shadow:4px_4px_0_#0A0A0A] flex items-center justify-center">
            <span className="font-display font-black text-3xl text-ink leading-none">M</span>
          </div>
          {/* Animated corner accent */}
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-sm bg-pink border border-ink animate-bounce" />
        </div>

        {/* Pulsing bar */}
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-sm bg-ink border border-ink"
              style={{
                animation: `loadingPulse 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes loadingPulse {
          from { opacity: 0.2; transform: scaleY(0.5); }
          to   { opacity: 1;   transform: scaleY(1.4); }
        }
      `}</style>
    </div>
  );
}
