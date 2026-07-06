# Timeout — Website Redesign Proposal

Handoff document for the 2026 UI/UX overhaul. The implementation shipped alongside this doc;
file references point at the live code.

---

## 1. Creative direction

**"Broadcast stage, not landing page."** The homepage *is* the game. The visual language borrows
from three places:

- **NBA playoff broadcast packages** — lower-third eyebrow labels with an orange tick
  (`.eyebrow` in `app/globals.css`), condensed uppercase display type for team names, tabular
  numerals for every score and rating.
- **The scouting room** — the three mystery squads are presented as *sealed scouting files*
  ("Squad file 01 · SEALED · Era unknown"), not slot machines. Suspense comes from staggered
  reveals and copy ("Searching eras…", "Pulling roster…"), never casino aesthetics.
- **The arena at night** — a fixed near-black backdrop (`ArenaBackground` in `app/layout.tsx`)
  with a warm spotlight from the rafters, barely-visible half-court geometry, and a grain pass.
  Deep, but not a flat dark-blue page.

Basketball orange (`#f97316`) is reserved for *decisions and live states*: primary CTAs, the
active progress step, the accent tick, the VS roundel. Surfaces stay neutral
(`ink #0a0d12`, `panel #12161d`, `raised #171c24`). Gold marks winners; green/red mark the
user's call landing or missing.

## 2. UX flow

One round = one state machine (`components/round/RoundStage.tsx`):

```
Ready ─Start Round→ Spinning ─(staggered reveal ×3)→ Choose ─Trust a team→
Versus (opponent unsealed) ─Run Simulation→ Result ─Run it back / New round→ …
```

Rules the flow enforces:

- The opponent is drawn at spin time but stays **sealed until the user commits** — the
  `OpponentTicker` bar keeps it present ("Opponent — sealed until you commit").
- The user always knows where they are: the 5-step progress tracker (Spin → Choose → Reveal →
  Simulate → Result) lives in the stage header, with "New round" as a permanent escape hatch.
- Result renders **inline** (no page navigation) from the `/api/simulate` response, so replay
  loops are one click. Deep links: "Full box score" → `/result/[id]`, Share → `/share/[id]`.
- Every round is saved to local history and feeds the "Recent matchups" section live (via a
  `timeout:history-updated` window event).

## 3. Homepage wireframe

```
┌──────────────────────────────────────────────────────────────┐
│ ◉ TIMEOUT  Cross-era NBA matchup simulator   PLAY MATCHUP …  │  compact header
├──────────────────────────────────────────────────────────────┤
│ ┌─ ROUND STAGE ── [✓Spin]─[Choose]─[Reveal]…── New round ─┐  │
│ │              SPIN THREE MYSTERY SQUADS.                  │  │  headline per phase
│ │                  [ ▶ START ROUND ]                       │  │  primary CTA
│ │  ┌──────────┐   ┌──────────┐   ┌──────────┐              │  │
│ │  │ FILE 01  │   │ FILE 02  │   │ FILE 03  │              │  │  sealed slots →
│ │  │  SEALED  │   │  SEALED  │   │  SEALED  │              │  │  squad cards →
│ │  └──────────┘   └──────────┘   └──────────┘              │  │  versus → result
│ │  · Opponent — sealed until you commit ·                  │  │
│ └───────────────────────────────────────────────────────────┘ │
│  HOW TIMEOUT WORKS   (Spin / Trust / Reveal / Simulate)       │
│  BUILT FOR CROSS-ERA DEBATES  (+ link to Custom Matchup)      │
│  RECENT MATCHUPS  (local history, sample cards for new users) │
│  ERA ARCHIVE  (per-decade cards → /teams)                     │
│  footer                                                       │
└──────────────────────────────────────────────────────────────┘
```

## 4. Visual design system

- **Color tokens** (`tailwind.config.ts`): `ink` (page), `panel`/`raised` (surfaces), `line`
  (hairlines), `muted` (secondary text), `court` orange (action), `gold` (winner),
  `win`/`loss` (verdicts). Team identity comes exclusively from `lib/teamColors.ts` via the
  two-tone header stripe and initial roundels — cards stay neutral so 3 teams stay comparable.
- **Type system** (`app/layout.tsx` via `next/font`):
  - Display: **Barlow Condensed** 600–800 — matchup titles, team names, all scores.
  - UI/body: **Inter** — controls, supporting copy.
  - Numerals: `tabular-nums` everywhere numbers align (records, ratings, quarters, box lines).
- **Framing motifs**: 1px hairlines, a 4px orange gradient bar on the stage, eyebrow ticks,
  quarter strips styled like a scoreboard footer.

## 5. Component inventory

| Component | File |
| --- | --- |
| Header / nav / footer | `app/layout.tsx`, `components/MainNav.tsx` |
| Round stage (state machine, mobile action bar) | `components/round/RoundStage.tsx` |
| Progress tracker | `components/round/ProgressTracker.tsx` |
| Mystery squad card (sealed / spinning) | `components/round/MysteryCard.tsx` |
| Revealed squad card + trust action | `components/round/SquadCard.tsx` |
| Versus screen + stat comparison rows | `components/round/VersusPanel.tsx` |
| Result summary panel (score, quarters, factors, MVP, actions) | `components/round/ResultPanel.tsx` |
| How-it-works / cross-era band / era archive | `components/home/HomeSections.tsx` |
| Recent matchup cards | `components/home/RecentMatchups.tsx` |

Client payload note: the page ships a slimmed `RoundTeam` (`lib/round.ts`) — ratings, record,
top-3 stars, derived identity tag — not full rosters. Simulation runs server-side by team id.

## 6. Responsive behavior

- **375–639px**: cards stack; Start Round sits directly under the headline; a fixed bottom
  action bar appears in Versus ("Run Simulation") and Result ("Run it back" / "New round");
  progress tracker collapses to checks + numbers; nav uses short labels on a second header row.
- **768px**: squad cards go 3-up (`md:grid-cols-3`); bottom bar disappears (`sm:hidden`).
- **1440px / 1920px**: the stage is a centered `max-w-6xl` panel — broadcast desk framing —
  with the "How Timeout works" section peeking below the fold. The fixed arena backdrop covers
  any width.
- Grid safety per project convention: stacked by default, grids enabled at breakpoints,
  `min-w-0`/`truncate` on text-bearing flex children.

## 7. Copy (key screens)

- Ready: **"Spin three mystery squads."** / "Three teams, three eras, one sealed opponent.
  Trust the squad built to win." CTA **Start Round**.
- Spinning: "Scouting the eras…" with per-card status: *Searching eras / Pulling roster /
  Locking squad*.
- Choose: **"Trust one squad."** / "One of these three carries your call. The opponent stays
  sealed until you commit." Card CTA **Trust this team** → **Locked in / Your call**.
- Versus: **"The matchup is set."** / "No takebacks after the ball goes up." CTA
  **Run Simulation** (loading: "Calling the game…").
- Result: eyebrow **FINAL**, "{Season} {Team} win it", verdict chip **"You called it"** /
  **"Upset — your squad falls"**; actions **Run it back · New round · Share · Full box score**.

## 8. Interaction & animation notes

All keyframes in `app/globals.css`; every one is disabled under `prefers-reduced-motion`.

- Spin: text flicker inside sealed files (95ms cycle), then a staggered reveal (~1.0s / 1.65s /
  2.3s) — anticipation without a 5-second slot machine.
- Trust: chosen card gets an orange ring + `lock-pulse` shockwave; siblings dim to 40%;
  auto-advance to Versus after 750ms.
- Versus: panels slide in from opposite wings; comparison bars grow outward from the center
  with 70ms stagger.
- Result: winner banner pops first (`winner-pop`); explanation, factors, and MVP fade up 550ms
  later — verdict before detail.

## 9. Accessibility

- Full keyboard path (all actions are real `<button>`s); global `:focus-visible` orange ring.
- `aria-live="polite"` phase announcements in the stage; `role="alert"` on simulation errors;
  `aria-pressed` on trust buttons; `aria-current` on nav and progress steps.
- 44px-class tap targets on mobile CTAs; quarter tables are real `<table>`s with scoped headers;
  color verdicts always pair with text ("Win"/"Loss", "You called it").

## 10. Implementation notes

- Homepage stays a server component (`app/page.tsx`) that precomputes `RoundTeam`s and era
  summaries; only the stage and recent-matchups are client components.
- Simulation contract unchanged: `POST /api/simulate` with `{teamAId, teamBId, mode, ruleset}`;
  the seed-encoded simulation id keeps result/share URLs stable with zero storage.
- "Leaderboard" from the brief was deliberately not added as a dead link; the nav maps to real
  routes (Play / Custom Matchup / Teams / About). A future leaderboard can reuse the round
  history schema (`lib/roundHistory.ts`).
- Verified via CDP at 390×844 (mobile) and 1440×900 through all five states:
  no horizontal overflow, full round playable end-to-end against the live API.
