import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { Code2 } from "lucide-react";
import { MainNav } from "@/components/MainNav";
import { PublicShareHostRedirect } from "@/components/PublicShareHostRedirect";
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
        <PublicShareHostRedirect />
        <CourtBackground />
        <div className="min-h-screen">
          <header className="relative z-50">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 pb-1 pt-3 sm:px-6 sm:pb-2 sm:pt-4 lg:px-8">
              <Link href="/" className="group flex flex-col items-center gap-0">
                <span className="relative block h-16 w-16 transition duration-200 group-hover:scale-105 sm:h-24 sm:w-24">
                  <Image
                    src="/timeout-logo-mark.png"
                    alt="Timeout"
                    fill
                    priority
                    sizes="96px"
                    className="object-contain drop-shadow-[0_8px_18px_rgba(28,13,3,0.45)]"
                  />
                </span>
                <span className="-mt-1 text-center">
                  <span className="brand-title block text-lg font-black uppercase tracking-normal sm:text-2xl">
                    Timeout
                  </span>
                  <span className="block text-[9px] font-black uppercase tracking-[0.22em] text-orange-100 drop-shadow-[0_2px_0_rgba(124,45,18,0.95)] sm:text-[10px]">
                    Est. 2026
                  </span>
                </span>
              </Link>
              <MainNav />
              <a
                href="https://github.com/Dheerajsom/Timeout"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Timeout on GitHub"
                className="absolute right-4 top-3 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/20 bg-neutral-950 px-3 text-xs font-black uppercase tracking-normal text-white shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition hover:border-orange-300 hover:bg-orange-500 sm:right-6 sm:top-4 sm:h-11 sm:px-4 lg:right-8"
              >
                <Code2 className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </header>
          {children}
          <footer className="relative z-40 px-4 pb-10 text-center text-xs font-bold uppercase tracking-[0.14em] text-white/85 drop-shadow-[0_2px_0_rgba(0,0,0,0.65)] sm:px-6 sm:pb-6 lg:px-8">
            Timeout is an independent project and not affiliated with the NBA.
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}

function CourtBackground() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        background: "#a96830",
      }}
    >
      <defs>
        <linearGradient id="courtWood" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#d09452" />
          <stop offset="0.45" stopColor="#c07f42" />
          <stop offset="1" stopColor="#9c5f2b" />
        </linearGradient>
        <pattern id="courtPlanks" width="96" height="900" patternUnits="userSpaceOnUse">
          <path d="M48 0V900" stroke="#6f3a18" strokeOpacity="0.14" strokeWidth="1.5" />
          <path d="M96 0V900" stroke="#6f3a18" strokeOpacity="0.18" strokeWidth="1.5" />
          <path
            d="M0 120H48M48 290H96M0 470H48M48 640H96M0 810H48"
            stroke="#fae3b8"
            strokeOpacity="0.08"
            strokeWidth="1.5"
          />
        </pattern>
        <radialGradient id="courtSpot" cx="0.5" cy="0.4" r="0.9">
          <stop offset="0" stopColor="#ffe9c2" stopOpacity="0.2" />
          <stop offset="0.45" stopColor="#ffdfae" stopOpacity="0.04" />
          <stop offset="1" stopColor="#2a1304" stopOpacity="0.52" />
        </radialGradient>
        <linearGradient id="courtTop" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1c0d03" stopOpacity="0.5" />
          <stop offset="0.35" stopColor="#1c0d03" stopOpacity="0.08" />
          <stop offset="1" stopColor="#1c0d03" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#courtWood)" />
      <rect width="1440" height="900" fill="url(#courtPlanks)" />

      <g fill="#7c3414">
        <rect x="40" y="320" width="300" height="260" opacity="0.16" />
        <rect x="1100" y="320" width="300" height="260" opacity="0.16" />
        <circle cx="720" cy="450" r="80" opacity="0.12" />
      </g>

      <g
        fill="none"
        stroke="#fdf3e0"
        strokeOpacity="0.38"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="40" y="40" width="1360" height="820" />
        <line x1="720" x2="720" y1="40" y2="860" />
        <circle cx="720" cy="450" r="80" />
        <circle cx="720" cy="450" r="24" />

        <rect x="40" y="320" width="300" height="260" />
        <rect x="1100" y="320" width="300" height="260" />

        <path d="M340 355A95 95 0 0 1 340 545" />
        <path d="M340 355A95 95 0 0 0 340 545" strokeDasharray="9 11" />
        <path d="M1100 355A95 95 0 0 0 1100 545" />
        <path d="M1100 355A95 95 0 0 1 1100 545" strokeDasharray="9 11" />

        <path d="M126 410A40 40 0 0 1 126 490" />
        <path d="M1314 410A40 40 0 0 0 1314 490" />
        <line x1="110" x2="110" y1="392" y2="508" />
        <line x1="1330" x2="1330" y1="392" y2="508" />

        <path d="M40 113H170" />
        <path d="M40 787H170" />
        <path d="M170 113A340 340 0 0 1 170 787" />
        <path d="M1400 113H1270" />
        <path d="M1400 787H1270" />
        <path d="M1270 113A340 340 0 0 0 1270 787" />
      </g>

      <g fill="none" stroke="#ff8c42" strokeOpacity="0.5" strokeWidth="3">
        <circle cx="126" cy="450" r="11" />
        <circle cx="1314" cy="450" r="11" />
      </g>

      <rect width="1440" height="900" fill="url(#courtSpot)" />
      <rect width="1440" height="900" fill="url(#courtTop)" />
    </svg>
  );
}
