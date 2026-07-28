# Timeout

NBA "what-if" matchup simulator. Pick two teams from any era and simulate a single game or a
best-of-7 series. Built with **Next.js (App Router) + React + TypeScript + Tailwind CSS**.

## Model selection

**NEVER use Haiku 4.5 for anything at all.** For small tasks and delegated work, use Sonnet 5
with medium or high reasoning effort.

## Commands

```bash
npm run dev      # start dev server (Turbopack) on http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run test     # vitest run
```

There is no separate type-check script; use `npx tsc --noEmit` to type-check.

## How the simulation works

The simulation is **deterministic from a seed** — there is no real database dependency at read time.

- `POST /api/simulate` (`app/api/simulate/route.ts`) validates the request with
  `lib/validators/simulateRequest.ts` (zod), resolves the team pair, and runs
  `lib/simulation/simulateGame.ts` or `simulateSeries.ts` using a seeded RNG (`lib/simulation/rng.ts`).
- `lib/simulationStore.ts` does **not** persist results. It encodes the inputs
  (`teamAId`, `teamBId`, `mode`, `ruleset`, `seed`) into the simulation **id** itself
  (a readable `a-vs-b__game__modern__<seed>` slug, or a base64url `sim_…` fallback).
  `getSimulation(id)` decodes that id and **re-runs the simulation** to reproduce the exact result.
  This is why result/share URLs are stable and shareable without storage.
- A Prisma schema (`prisma/schema.prisma`) and `data/simulations.json` exist as a legacy/optional
  store, but the live flow is seed-based and stateless.

Team data lives in `lib/teams.ts` (+ `lib/modernRosters.ts`); team rating shape is in
`types/simulation.ts` (`Team`, `Player`, box-score and result types). Team colors come from
`lib/teamColors.ts`.

**Never pass the full `Team[]` to a client component.** The pool is ~1,300 teams with complete
rosters, so serializing it across a client boundary adds megabytes to the RSC payload (it once made
`/matchup` a 4 MB document). Use a slimmed projection instead — `lib/teamSummary.ts` (`TeamSummary`,
for pickers) or `lib/round.ts` (`RoundTeam`, for the round stage) — and simulate by id via
`POST /api/simulate`. Both projections are precomputed at module scope; keep them that way.

## Routes & key components

- `app/page.tsx` — "Spin Mode" (random matchup wheel).
- `app/matchup/page.tsx` → `components/CustomMatchup.tsx` — "Custom Matchup": pick two squads manually.
- `app/result/[id]/page.tsx` — renders a decoded simulation (scoreboard, box scores, MVP, factors).
- `app/share/[id]/` — shareable result page + OpenGraph image.
- `app/teams/`, `app/about/` — supporting pages.
- `components/MainNav.tsx` — top segmented nav (Spin Mode / Custom Matchup), in `app/layout.tsx`.
- Result UI: `Scoreboard`, `BoxScoreTable`, `MvpCard`, `MatchupFactors`,
  `SeriesSummary`, `SeriesBoxScores`, `TeamRadarChart`.

## Styling conventions (read before editing layout)

- Tailwind, mobile-first. Breakpoints in use: `sm` (640px) and `lg` (1024px). The site has a
  dark theme over a fixed SVG "court" background rendered in `app/layout.tsx` (`CourtBackground`).
- **Responsive grid pitfall:** do not apply a bare `grid` with column counts only at a larger
  breakpoint (e.g. `grid … lg:grid-cols-2`). On small screens that leaves a single *implicit* `auto`
  grid track, which expands to its content's min-content width and overflows the viewport — and a
  parent `overflow-hidden` then clips it instead of wrapping. Prefer stacking with block/`space-y-*`
  on mobile and enabling the grid at the breakpoint (`lg:grid lg:grid-cols-2`), and add `min-w-0`
  to grid/flex children that contain scrollable or long content. Tailwind's `grid-cols-N` uses
  `minmax(0,1fr)` (safe); a bare implicit track does not.
- `CustomMatchup` shows both squad pickers side-by-side on `lg`, and on smaller screens uses a
  segmented tab (`PickerTab`) to show one full-width picker at a time, plus a fixed bottom action
  bar (`sm:hidden`).

## Verifying UI changes

For mobile/layout work, verify in a real mobile viewport (don't trust the CLI `--screenshot`
viewport sizing). Launch Chrome with `--remote-debugging-port` and use the DevTools Protocol with
`Emulation.setDeviceMetricsOverride` (`mobile:true`) to set a 390×844 viewport, then check
`document.documentElement.scrollWidth === clientWidth` and capture `Page.captureScreenshot`.
