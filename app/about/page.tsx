export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black tracking-normal text-white">About Timeout</h1>
      <div className="mt-6 space-y-5 text-sm leading-7 text-muted">
        <p>
          Timeout is a historical NBA matchup simulator. The first version uses hand-tuned
          team and player ratings, era ruleset modifiers, and seeded randomness to produce
          believable games and series.
        </p>
        <p>
          The result is not a random text generator. Scores, box scores, MVPs, and explanations
          all come from the same structured matchup model, so a spacing edge or physicality edge
          can show up both in the numbers and in the recap.
        </p>
        <p>
          This is an independent fan project and is not affiliated with, endorsed by, or sponsored
          by the National Basketball Association.
        </p>
      </div>
    </main>
  );
}
