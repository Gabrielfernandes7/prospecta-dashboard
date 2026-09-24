'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LeadModal from './LeadModal';

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
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [niches, setNiches] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/niches').then(r => r.json()),
      fetch('/api/solutions').then(r => r.json()),
    ]).then(([n, s]) => {
      setNiches(Array.isArray(n) ? n : []);
      setSolutions(Array.isArray(s) ? s : []);
    });
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:bg-slate-900/95 dark:border-slate-700">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold dark:bg-slate-100 dark:text-slate-900">
              LC
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">Prospecta</span>
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
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewLeadModalOpen(true)}
              className="h-9 px-4 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              + Novo lead
            </button>
          </div>
        </div>
      </header>

      {isNewLeadModalOpen && (
        <LeadModal
          leadId={null}
          niches={niches}
          solutions={solutions}
          onSuccess={() => {
            setIsNewLeadModalOpen(false);
            window.location.reload();
          }}
          onClose={() => setIsNewLeadModalOpen(false)}
        />
      )}
    </>
  );
}
