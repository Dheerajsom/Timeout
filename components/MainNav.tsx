"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Play", shortLabel: "Play" },
  { href: "/matchup", label: "Custom Matchup", shortLabel: "Matchup" },
  { href: "/teams", label: "Teams", shortLabel: "Teams" },
  { href: "/about", label: "About", shortLabel: "About" },
];

export function MainNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={`items-center gap-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md px-2 text-xs font-black uppercase tracking-[0.12em] transition sm:px-3.5 ${
              isActive
                ? "text-white after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-orange-500"
                : "text-muted hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
