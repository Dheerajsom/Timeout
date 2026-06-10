import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { Code2 } from "lucide-react";
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
            <div className="mx-auto flex max-w-7xl items-center justify-center px-4 pb-1 pt-3 sm:px-6 sm:pb-2 sm:pt-5 lg:px-8">
              <Link href="/" className="group flex flex-col items-center gap-0">
                <span className="relative block h-20 w-20 transition duration-200 group-hover:scale-105 sm:h-32 sm:w-32">
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
                  <span className="brand-title block text-xl font-black uppercase tracking-normal sm:text-3xl">
                    Timeout
                  </span>
                  <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-orange-100 drop-shadow-[0_2px_0_rgba(124,45,18,0.95)] sm:text-[11px]">
                    Est. 2026
                  </span>
                </span>
              </Link>
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
      viewBox="0 0 940 500"
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        background:
          "linear-gradient(90deg, #b96a2e 0%, #f1bd73 18%, #d89144 34%, #f4c57c 50%, #c77a36 66%, #efb66b 82%, #a85a27 100%)",
      }}
    >
      <defs>
        <linearGradient id="courtFloor" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f3c27a" />
          <stop offset="0.28" stopColor="#d89448" />
          <stop offset="0.5" stopColor="#efbd73" />
          <stop offset="0.74" stopColor="#bd7434" />
          <stop offset="1" stopColor="#e8ad62" />
        </linearGradient>
        <pattern id="courtPlanks" width="94" height="500" patternUnits="userSpaceOnUse">
          <rect width="94" height="500" fill="transparent" />
          <path d="M0 0V500M94 0V500" stroke="#6f3a18" strokeOpacity="0.22" strokeWidth="1.5" />
          <path d="M0 86H94M0 207H94M0 333H94M0 448H94" stroke="#fff0c2" strokeOpacity="0.12" />
        </pattern>
        <linearGradient id="courtShade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff2c7" stopOpacity="0.16" />
          <stop offset="0.46" stopColor="#05070c" stopOpacity="0.02" />
          <stop offset="1" stopColor="#05070c" stopOpacity="0.18" />
        </linearGradient>
      </defs>

      <rect width="940" height="500" fill="url(#courtFloor)" />
      <rect width="940" height="500" fill="url(#courtPlanks)" />
      <rect x="5" y="170" width="190" height="160" fill="#8f3f20" opacity="0.24" />
      <rect x="745" y="170" width="190" height="160" fill="#8f3f20" opacity="0.24" />

      <g fill="none" stroke="#fff9eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
        <rect x="5" y="5" width="930" height="490" />
        <line x1="470" x2="470" y1="5" y2="495" />
        <circle cx="470" cy="250" r="60" />

        <path d="M5 170H195V330H5" />
        <path d="M935 170H745V330H935" />

        <path d="M195 190A60 60 0 0 1 195 310" />
        <path d="M195 190A60 60 0 0 0 195 310" strokeDasharray="10 10" />
        <path d="M745 190A60 60 0 0 0 745 310" />
        <path d="M745 190A60 60 0 0 1 745 310" strokeDasharray="10 10" />

        <path d="M52.5 210A40 40 0 0 1 52.5 290" />
        <path d="M887.5 210A40 40 0 0 0 887.5 290" />

        <path d="M5 30H142" />
        <path d="M5 470H142" />
        <path d="M142 30A237.5 237.5 0 0 1 142 470" />
        <path d="M935 30H798" />
        <path d="M935 470H798" />
        <path d="M798 30A237.5 237.5 0 0 0 798 470" />
      </g>

      <g fill="#fff9eb">
        <circle cx="52.5" cy="250" r="6" />
        <circle cx="887.5" cy="250" r="6" />
      </g>
      <rect width="940" height="500" fill="url(#courtShade)" />
    </svg>
  );
}
