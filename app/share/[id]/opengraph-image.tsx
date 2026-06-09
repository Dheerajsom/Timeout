import { ImageResponse } from "next/og";
import { buildShareSummary } from "@/lib/shareSummary";
import { getSimulation } from "@/lib/simulationStore";
import { getTeamColors } from "@/lib/teamColors";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const simulation = await getSimulation(id);

  if (!simulation) {
    return new ImageResponse(
      (
        <div
          style={{
            alignItems: "center",
            background: "#15100b",
            color: "white",
            display: "flex",
            fontSize: 64,
            fontWeight: 900,
            height: "100%",
            justifyContent: "center",
            width: "100%",
          }}
        >
          Timeout Result
        </div>
      ),
      size,
    );
  }

  const result = simulation.result;
  const winner = result.winnerTeamId === result.teamA.id ? result.teamA : result.teamB;
  const loser = result.winnerTeamId === result.teamA.id ? result.teamB : result.teamA;
  const colors = getTeamColors(winner);
  const summary = buildShareSummary(result);
  const winnerLabel = `${winner.season} ${winner.franchise} win`;
  const loserLabel = `vs ${loser.season} ${loser.franchise}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#111111",
          color: "white",
          display: "flex",
          height: "100%",
          padding: 48,
          width: "100%",
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary} 56%, ${colors.secondary} 56%, ${colors.secondary} 100%)`,
            border: "6px solid rgba(255,255,255,0.22)",
            borderRadius: 18,
            boxShadow: "0 34px 90px rgba(0,0,0,0.45)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            overflow: "hidden",
            padding: 44,
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg,#fb923c,#facc15,#14b8a6)",
              height: 12,
              left: 0,
              position: "absolute",
              right: 0,
              top: 0,
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 760 }}>
              <div style={{ display: "flex", fontSize: 28, fontWeight: 900, letterSpacing: 5, textTransform: "uppercase" }}>
                Timeout Result
              </div>
              <div style={{ display: "flex", fontSize: 78, fontWeight: 900, lineHeight: 0.94 }}>
                {winnerLabel}
              </div>
              <div style={{ display: "flex", fontSize: 34, fontWeight: 800 }}>
                {loserLabel}
              </div>
            </div>
            <div
              style={{
                alignItems: "center",
                background: "white",
                borderRadius: 16,
                color: "#111111",
                display: "flex",
                fontSize: 58,
                fontWeight: 900,
                height: 110,
                justifyContent: "center",
                minWidth: 220,
                padding: "0 28px",
              }}
            >
              {summary.scoreLabel}
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              background: "rgba(0,0,0,0.42)",
              border: "3px solid rgba(255,255,255,0.2)",
              borderRadius: 16,
              display: "flex",
              justifyContent: "space-between",
              padding: "28px 34px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ color: "#fed7aa", display: "flex", fontSize: 24, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase" }}>
                MVP
              </div>
              <div style={{ display: "flex", fontSize: 48, fontWeight: 900 }}>{result.mvp.name}</div>
            </div>
            <div style={{ display: "flex", gap: 18 }}>
              <OgStat label="PTS" value={result.mvp.points} />
              <OgStat label="REB" value={result.mvp.rebounds} />
              <OgStat label="AST" value={result.mvp.assists} />
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

function OgStat({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "rgba(255,255,255,0.14)",
        border: "2px solid rgba(255,255,255,0.22)",
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        height: 112,
        justifyContent: "center",
        width: 118,
      }}
    >
      <div style={{ display: "flex", fontSize: 42, fontWeight: 900 }}>{value}</div>
      <div style={{ color: "#fed7aa", display: "flex", fontSize: 20, fontWeight: 900 }}>{label}</div>
    </div>
  );
}
