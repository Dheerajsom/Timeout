import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { Code2 } from "lucide-react";
import { MainNav } from "@/components/MainNav";
import { PublicShareHostRedirect } from "@/components/PublicShareHostRedirect";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

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
    <html lang="en" className={`${inter.variable} ${barlow.variable}`}>
      <body className="font-sans antialiased">
        <PublicShareHostRedirect />
        <ArenaBackground />
        <div className="flex min-h-screen flex-col">
          <header className="relative z-50 border-b border-line bg-ink/78 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
              <Link href="/" className="group flex min-w-0 items-center gap-2.5">
                <span className="relative block h-9 w-9 shrink-0 transition duration-200 group-hover:scale-105 sm:h-10 sm:w-10">
                  <Image
                    src="/timeout-logo-mark.png"
                    alt=""
                    fill
                    priority
                    sizes="40px"
                    className="object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-xl font-extrabold uppercase leading-none tracking-[0.08em] text-white sm:text-2xl">
                    Timeout
                  </span>
                  <span className="mt-0.5 hidden text-[10px] font-bold uppercase tracking-[0.2em] text-muted sm:block">
                    Cross-era NBA matchup simulator
                  </span>
                </span>
              </Link>

              <div className="flex items-center gap-2 sm:gap-3">
                <MainNav className="hidden md:flex" />
                <a
                  href="https://github.com/Dheerajsom/Timeout"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open Timeout on GitHub"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-line bg-panel px-3 text-xs font-black uppercase tracking-wide text-white transition hover:border-orange-400/60 hover:bg-raised"
                >
                  <Code2 className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden lg:inline">GitHub</span>
                </a>
              </div>
            </div>
            <div className="border-t border-line md:hidden">
              <MainNav className="mx-auto flex h-11 max-w-7xl items-center justify-center px-2" />
            </div>
          </header>

          <div className="flex-1">{children}</div>

          <footer className="relative z-40 border-t border-line bg-ink/70">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-6 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
              <div>
                <span className="font-display text-lg font-extrabold uppercase tracking-[0.08em] text-white">
                  Timeout
                </span>
                <p className="mt-1 text-xs font-semibold text-muted">
                  An independent project, not affiliated with the NBA.
                </p>
              </div>
              <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-[0.14em] text-muted">
                <Link href="/" className="transition hover:text-white">Play</Link>
                <Link href="/matchup" className="transition hover:text-white">Custom Matchup</Link>
                <Link href="/teams" className="transition hover:text-white">Team Archive</Link>
                <Link href="/about" className="transition hover:text-white">About</Link>
              </nav>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}

/**
 * Deep arena backdrop: near-black base, a warm broadcast spotlight from the
 * rafters, faint half-court geometry, and a light grain pass so large dark
 * areas do not band.
 */
function ArenaBackground() {
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
        background: "#0a0d12",
      }}
    >
      <defs>
        <radialGradient id="arenaSpot" cx="0.5" cy="-0.12" r="1.05">
          <stop offset="0" stopColor="#ffb26b" stopOpacity="0.16" />
          <stop offset="0.32" stopColor="#f97316" stopOpacity="0.055" />
          <stop offset="0.62" stopColor="#0a0d12" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="arenaFloor" cx="0.5" cy="1.18" r="1">
          <stop offset="0" stopColor="#1b2230" stopOpacity="0.85" />
          <stop offset="0.55" stopColor="#10141c" stopOpacity="0.4" />
          <stop offset="1" stopColor="#0a0d12" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="arenaVignette" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#05070a" stopOpacity="0.55" />
          <stop offset="0.3" stopColor="#05070a" stopOpacity="0" />
          <stop offset="0.82" stopColor="#05070a" stopOpacity="0" />
          <stop offset="1" stopColor="#05070a" stopOpacity="0.6" />
        </linearGradient>
        <filter id="arenaGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.05" />
          </feComponentTransfer>
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
      </defs>

      <rect width="1440" height="900" fill="#0a0d12" />
      <rect width="1440" height="900" fill="url(#arenaFloor)" />

      {/* Half-court geometry, barely there. */}
      <g
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.05"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="720" cy="980" r="360" />
        <circle cx="720" cy="980" r="120" />
        <line x1="0" x2="1440" y1="620" y2="620" strokeOpacity="0.035" />
        <path d="M160 900V705a120 120 0 0 1 120-120h880a120 120 0 0 1 120 120v195" strokeOpacity="0.04" />
      </g>
      <g fill="none" stroke="#f97316" strokeOpacity="0.07" strokeWidth="2">
        <circle cx="720" cy="980" r="240" />
      </g>

      <rect width="1440" height="900" fill="url(#arenaSpot)" />
      <rect width="1440" height="900" fill="url(#arenaVignette)" />
      <rect width="1440" height="900" filter="url(#arenaGrain)" opacity="0.5" fill="transparent" />
    </svg>
  );
}
