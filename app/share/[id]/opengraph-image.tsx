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
  const loser = result.winnerTeamId === userTeam.id ? opponent : userTeam;
  const colors = getTeamColors(userTeam);
  const winnerLabel = `${winner.season} ${winner.franchise}`;
  const loserLabel = `${loser.season} ${loser.franchise}`;
  const userTeamLabel = `${userTeam.season} ${userTeam.franchise}`;
  const opponentLabel = `${opponent.season} ${opponent.franchise}`;
  const scoreLabel = `${game.teamAScore}-${game.teamBScore}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#111111",
          color: "white",
          display: "flex",
          height: "100%",
          padding: 44,
          width: "100%",
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary} 53%, #101010 53%, #101010 100%)`,
            border: "4px solid rgba(255,255,255,0.24)",
            borderRadius: 18,
            boxShadow: "0 36px 100px rgba(0,0,0,0.48)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            overflow: "hidden",
            padding: 36,
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 36%)",
              display: "flex",
              inset: 0,
              position: "absolute",
            }}
          />
          <div
            style={{
              background: "linear-gradient(90deg, rgba(0,0,0,0.38), rgba(0,0,0,0.08) 48%, rgba(0,0,0,0.42))",
              display: "flex",
              inset: 0,
              position: "absolute",
            }}
          />

          <div style={{ display: "flex", gap: 30, height: 322, position: "relative", width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
              <div
                style={{
                  border: "2px solid rgba(255,255,255,0.22)",
                  borderRadius: 10,
                  color: "rgba(255,255,255,0.86)",
                  display: "flex",
                  fontSize: 23,
                  fontWeight: 900,
                  letterSpacing: 5,
                  padding: "9px 16px",
                  textTransform: "uppercase",
                  width: 300,
                }}
              >
                Timeout Result
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 720 }}>
                <div style={{ display: "flex", fontSize: 58, fontWeight: 900, lineHeight: 0.92 }}>
                  {winnerLabel}
                </div>
                <div style={{ color: "rgba(255,255,255,0.78)", display: "flex", fontSize: 26, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>
                  beat
                </div>
                <div style={{ display: "flex", fontSize: 45, fontWeight: 900, lineHeight: 0.96 }}>
                  {loserLabel}
                </div>
              </div>
            </div>

            <div
              style={{
                alignItems: "center",
                background: "rgba(255,255,255,0.96)",
                borderRadius: 14,
                boxShadow: "0 18px 40px rgba(0,0,0,0.32)",
                color: "#111111",
                display: "flex",
                flexDirection: "column",
                height: 118,
                justifyContent: "center",
                padding: "0 30px",
                width: 244,
              }}
            >
              <div style={{ color: "#555555", display: "flex", fontSize: 18, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>
                Final
              </div>
              <div style={{ display: "flex", fontSize: 50, fontWeight: 900, lineHeight: 1 }}>
                {scoreLabel}
              </div>
            </div>
          </div>

          <div style={{ alignItems: "stretch", display: "flex", gap: 22, height: 158, position: "relative", width: "100%" }}>
            <div
              style={{
                background: "rgba(0,0,0,0.42)",
                border: "3px solid rgba(255,255,255,0.18)",
                borderRadius: 16,
                color: "white",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: 8,
                padding: "20px 26px",
              }}
            >
              <div style={{ color: "#fed7aa", display: "flex", fontSize: 20, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase" }}>
                MVP
              </div>
              <div style={{ display: "flex", fontSize: 32, fontWeight: 900, lineHeight: 1 }}>
                {result.mvp.name}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <OgStat label="PTS" value={result.mvp.points} />
                <OgStat label="REB" value={result.mvp.rebounds} />
                <OgStat label="AST" value={result.mvp.assists} />
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "3px solid rgba(255,255,255,0.18)",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                justifyContent: "center",
                padding: "20px 26px",
                width: 430,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <div style={{ alignItems: "center", display: "flex", gap: 14 }}>
                  <div style={{ color: "#fed7aa", display: "flex", fontSize: 18, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase" }}>
                    My pick
                  </div>
                  <div
                    style={{
                      background: userWon ? "#a7f3d0" : "#fda4af",
                      borderRadius: 8,
                      color: userWon ? "#064e3b" : "#881337",
                      display: "flex",
                      fontSize: 16,
                      fontWeight: 900,
                      letterSpacing: 2,
                      padding: "6px 10px",
                      textTransform: "uppercase",
                    }}
                  >
                    {userWon ? "Won" : "Lost"}
                  </div>
                </div>
                <div style={{ display: "flex", fontSize: 27, fontWeight: 900, lineHeight: 1.05 }}>
                  {userTeamLabel}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <div style={{ color: "#fed7aa", display: "flex", fontSize: 18, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase" }}>
                  Opponent
                </div>
                <div style={{ display: "flex", fontSize: 27, fontWeight: 900, lineHeight: 1.05 }}>
                  {opponentLabel}
                </div>
              </div>
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
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        height: 58,
        justifyContent: "center",
        width: 88,
      }}
    >
      <div style={{ display: "flex", fontSize: 25, fontWeight: 900 }}>{value}</div>
      <div style={{ color: "#fed7aa", display: "flex", fontSize: 13, fontWeight: 900 }}>{label}</div>
    </div>
  );
}
