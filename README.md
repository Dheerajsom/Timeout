# Timeout

Timeout is a Next.js NBA era matchup simulator. Pick historical teams, choose a ruleset, and run deterministic single-game or best-of-seven simulations with box scores, matchup factors, and result pages.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma schema for future database-backed persistence

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Deployment

The project is configured for Vercel and currently uses stateless result URLs, so it can run on the free tier without a database.

