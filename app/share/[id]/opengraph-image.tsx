import { ImageResponse } from "next/og";
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
  const game = result.type === "single_game" ? result : result.decidingGame;
  const userTeam = result.teamA;
  const opponent = result.teamB;
  const userWon = result.winnerTeamId === userTeam.id;
  const winner = result.winnerTeamId === userTeam.id ? userTeam : opponent;
  const colors = getTeamColors(userTeam);
  const winnerLabel = `${winner.season} ${winner.franchise} win`;
  const matchupLabel = `${userTeam.season} ${userTeam.franchise} vs ${opponent.season} ${opponent.franchise}`;
  const scoreLabel = `${game.teamAScore}-${game.teamBScore}`;

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
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary} 47%, #111111 47%, #111111 100%)`,
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
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 690 }}>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ border: "2px solid rgba(255,255,255,0.24)", borderRadius: 12, display: "flex", fontSize: 25, fontWeight: 900, letterSpacing: 5, padding: "12px 18px", textTransform: "uppercase" }}>
                  Timeout Result
                </div>
                <div style={{ background: userWon ? "#a7f3d0" : "#fda4af", borderRadius: 12, color: userWon ? "#064e3b" : "#881337", display: "flex", fontSize: 27, fontWeight: 900, letterSpacing: 4, padding: "12px 18px", textTransform: "uppercase" }}>
                  {userWon ? "I won!" : "I lost!"}
                </div>
              </div>
              <div style={{ display: "flex", fontSize: 118, fontWeight: 900, lineHeight: 0.86 }}>
                {scoreLabel}
              </div>
              <div style={{ display: "flex", fontSize: 31, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>
                {matchupLabel}
              </div>
              <div style={{ display: "flex", fontSize: 46, fontWeight: 900, lineHeight: 1 }}>
                {winnerLabel}
              </div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "3px solid rgba(255,255,255,0.18)",
                borderRadius: 16,
                color: "white",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minWidth: 350,
                padding: 28,
              }}
            >
              <div style={{ color: "#fed7aa", display: "flex", fontSize: 25, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase" }}>
                MVP
              </div>
              <div style={{ display: "flex", fontSize: 50, fontWeight: 900, lineHeight: 1.02 }}>
                {result.mvp.name}
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
                <OgStat label="PTS" value={result.mvp.points} />
                <OgStat label="REB" value={result.mvp.rebounds} />
                <OgStat label="AST" value={result.mvp.assists} />
              </div>
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
              padding: "24px 30px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ color: "#fed7aa", display: "flex", fontSize: 23, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase" }}>
                My pick
              </div>
              <div style={{ display: "flex", fontSize: 38, fontWeight: 900 }}>{userTeam.season} {userTeam.franchise}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "right" }}>
              <div style={{ color: "#fed7aa", display: "flex", fontSize: 23, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase" }}>
                Opponent
              </div>
              <div style={{ display: "flex", fontSize: 38, fontWeight: 900 }}>{opponent.season} {opponent.franchise}</div>
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
