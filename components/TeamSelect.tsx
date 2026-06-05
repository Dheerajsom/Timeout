"use client";

import type { Team } from "@/types/simulation";

export function TeamSelect({
  label,
  teams,
  value,
  onChange,
}: {
  label: string;
  teams: Team[];
  value: string;
  onChange: (value: string) => void;
}) {
  const selected = teams.find((team) => team.id === value);

  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-md border border-white/10 bg-ink px-3 text-sm text-white outline-none transition hover:border-white/25 focus:border-teal"
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
      {selected ? (
        <div className="mt-3 rounded-md border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-white">{selected.franchise}</span>
            <span className="text-muted">
              {selected.wins}-{selected.losses}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{selected.styleSummary}</p>
        </div>
      ) : null}
    </label>
  );
}
