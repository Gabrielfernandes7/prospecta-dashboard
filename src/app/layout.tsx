import type { Metadata } from "next";
import "./globals.css";
import { RootContent } from "./root-content";

export const metadata: Metadata = {
  title: "Prospecta — CRM de Prospecção",
  description: "Sistema de gestão de leads com timeline de interações",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased light" suppressHydrationWarning>
      <body className="h-full bg-white text-slate-900">
        <RootContent>{children}</RootContent>
      </body>
    </html>
  );
}
