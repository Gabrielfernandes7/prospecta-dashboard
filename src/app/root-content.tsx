'use client';

import { ThemeProvider } from "@/lib/theme-context";
import Header from "@/components/Header";

export function RootContent({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Header />
      <main className="flex-1">{children}</main>
    </ThemeProvider>
  );
}
