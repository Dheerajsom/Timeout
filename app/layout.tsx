import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Code2 } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Timeout | NBA Era Matchup Simulator",
  description: "Simulate the NBA matchups time never gave us.",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
          <header className="relative z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-center px-4 pb-2 pt-4 sm:px-6 sm:pt-5 lg:px-8">
              <Link href="/" className="group flex flex-col items-center gap-0">
                <span className="relative block h-28 w-28 transition duration-200 group-hover:scale-105 sm:h-32 sm:w-32">
                  <Image
                    src="/timeout-logo-mark.png"
                    alt="Timeout"
                    fill
                    priority
                    sizes="128px"
                    className="object-contain"
                  />
                </span>
                <span className="-mt-2 text-center">
                  <span className="block text-2xl font-black uppercase tracking-normal text-white drop-shadow-[2px_2px_0_rgba(255,107,0,0.9)] sm:text-3xl">
                    Timeout
                  </span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-orange-400">
                    Est. 2026
                  </span>
                </span>
              </Link>
              <a
                href="https://github.com/Dheerajsom/Timeout"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Timeout on GitHub"
                className="absolute right-4 top-4 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/20 bg-slate-950/80 px-3 text-xs font-black uppercase tracking-normal text-white shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition hover:border-orange-300 hover:bg-orange-500 sm:right-6 sm:px-4 lg:right-8"
              >
                <Code2 className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </header>
          {children}
          <footer className="relative z-40 px-4 pb-6 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white/55 sm:px-6 lg:px-8">
            Timeout is an independent project and not affiliated with the NBA.
          </footer>
        </div>
      </body>
    </html>
  );
}
