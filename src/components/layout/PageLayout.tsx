interface PageLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ sidebar, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 border-r-2 border-ink bg-surface z-20 overflow-y-auto">
        {sidebar}
      </aside>
      {/* Main content - shifted right on desktop */}
      <div className="md:ml-64 min-h-screen">
        {children}
      </div>
    </div>
  );
}
