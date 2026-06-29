import { Bell, User } from '@phosphor-icons/react/dist/ssr';

export function Header() {
  return (
    <header className="flex items-center justify-between px-5 pt-14 pb-4">
      <div>
        <p className="text-ink/50 text-sm font-semibold uppercase tracking-widest">
          Good morning
        </p>
        <h1 className="font-display font-bold text-2xl text-ink leading-tight mt-0.5">
          Alex Johnson 👋
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-surface border-2 border-ink [box-shadow:2px_2px_0_#0A0A0A] hover:[box-shadow:4px_4px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all">
          <Bell size={20} weight="bold" className="text-ink" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink rounded-full border-2 border-background" />
        </button>
        <button className="w-10 h-10 rounded-xl bg-yellow border-2 border-ink [box-shadow:2px_2px_0_#0A0A0A] flex items-center justify-center transition-all hover:[box-shadow:4px_4px_0_#0A0A0A] active:[box-shadow:0px_0px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px]">
          <User size={20} weight="bold" className="text-ink" />
        </button>
      </div>
    </header>
  );
}
