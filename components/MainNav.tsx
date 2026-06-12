"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dices, Swords } from "lucide-react";

const tabs = [
  { href: "/", label: "Spin Mode", icon: Dices },
  { href: "/matchup", label: "Custom Matchup", icon: Swords },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Game modes"
      className="mx-auto mt-2 flex w-fit items-center gap-1 rounded-md border border-white/20 bg-neutral-950 p-1 shadow-[0_14px_36px_rgba(0,0,0,0.28)]"
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex h-9 items-center justify-center gap-2 rounded px-4 text-xs font-black uppercase tracking-normal transition sm:text-sm ${
              isActive
                ? "bg-orange-500 text-white shadow-[0_8px_22px_rgba(255,107,0,0.3)]"
                : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
