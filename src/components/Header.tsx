'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/kanban', label: 'Kanban' },
  { href: '/leads', label: 'Leads' },
  { href: '/interacoes', label: 'Interações' },
  { href: '/followups', label: 'Follow-ups' },
  { href: '/configuracoes', label: 'Configurações' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
            LC
          </div>
          <span className="font-semibold text-foreground">Prospecta</span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            + Novo lead
          </button>
        </div>
      </div>
    </header>
  );
}
