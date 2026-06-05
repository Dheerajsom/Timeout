import type { Metadata } from "next";
import Link from "next/link";
import { TimerReset } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Timeout | NBA Era Matchup Simulator",
  description: "Simulate the NBA matchups time never gave us.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen">
          <header className="fixed inset-x-0 top-0 z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="group flex flex-col items-center gap-2">
                <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-orange-500 bg-orange-500 text-ink shadow-[0_0_24px_rgba(255,107,0,0.28)] transition group-hover:scale-105">
                  <TimerReset className="h-7 w-7" aria-hidden="true" />
                </span>
                <span className="text-center">
                  <span className="block text-2xl font-black uppercase tracking-normal text-white drop-shadow-[2px_2px_0_rgba(255,107,0,0.9)]">
                    Timeout
                  </span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-orange-400">
                    Est. 2026
                  </span>
                </span>
              </Link>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
