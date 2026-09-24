import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prospecta — CRM de Prospecção",
  description: "Sistema de gestão de leads com timeline de interações",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="h-full bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
