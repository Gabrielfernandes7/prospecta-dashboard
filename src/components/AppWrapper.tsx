'use client';

import { ThemeProvider } from '@/lib/theme-context';
import Header from './Header';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Header />
      <main className="flex-1">{children}</main>
    </ThemeProvider>
  );
}
