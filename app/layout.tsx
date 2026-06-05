import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
          <header className="fixed inset-x-0 top-0 z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="group flex flex-col items-center gap-2">
                <span className="relative block h-16 w-16 overflow-hidden rounded-full border-2 border-orange-400 bg-black shadow-[0_0_28px_rgba(255,107,0,0.34)] transition group-hover:scale-105">
                  <Image
                    src="/timeout-logo-mark.png"
                    alt="Timeout"
                    fill
                    priority
                    sizes="64px"
                    className="object-cover"
                  />
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
