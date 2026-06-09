import { ImageResponse } from "next/og";
import { getSimulation } from "@/lib/simulationStore";
import { getTeamColors, type TeamColors } from "@/lib/teamColors";
import type { Team } from "@/types/simulation";

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
  const colors = getTeamColors(winner);
  const accentColor = getVisibleAccent(colors);
  const winnerScore = scoreForTeam(winner.id, game.teamA.id, game.teamAScore, game.teamBScore);
  const loserScore = scoreForTeam(loser.id, game.teamA.id, game.teamAScore, game.teamBScore);

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, #050506 0%, #101114 54%, ${hexToRgba(colors.primary, 0.24)} 100%)`,
          color: "white",
          display: "flex",
          height: "100%",
          padding: 38,
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#101113",
            border: "2px solid rgba(255,255,255,0.18)",
            borderRadius: 8,
            boxShadow: "0 34px 90px rgba(0,0,0,0.52)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            padding: 36,
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(colors.primary, 0.32)} 0%, rgba(255,255,255,0.035) 42%, transparent 78%)`,
              display: "flex",
              height: "100%",
              left: 0,
              position: "absolute",
              top: 0,
              width: "100%",
            }}
          />
          <div
            style={{
              background: `linear-gradient(180deg, ${hexToRgba(accentColor, 0.18)}, transparent 36%)`,
              display: "flex",
              height: 220,
              left: 0,
              position: "absolute",
              top: 0,
              width: "100%",
            }}
          />

          <div
            style={{
              alignItems: "center",
              display: "flex",
              height: 56,
              justifyContent: "space-between",
              position: "relative",
              width: "100%",
            }}
          >
            <div style={{ alignItems: "center", display: "flex", gap: 14 }}>
              <div
                style={{
                  background: accentColor,
                  borderRadius: 3,
                  display: "flex",
                  height: 34,
                  width: 8,
                }}
              />
              <div
                style={{
                  color: "rgba(255,255,255,0.86)",
                  display: "flex",
                  fontSize: 26,
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Timeout Result
              </div>
            </div>

            <div
              style={{
                alignItems: "center",
                background: userWon ? "#a7f3d0" : "#fda4af",
                borderRadius: 8,
                color: userWon ? "#064e3b" : "#881337",
                display: "flex",
                fontSize: 26,
                fontWeight: 900,
                height: 46,
                justifyContent: "center",
                padding: "0 22px",
                textTransform: "uppercase",
              }}
            >
              {userWon ? "I won!" : "I lost!"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              marginTop: 24,
              position: "relative",
              width: "100%",
            }}
          >
            <div
              style={{
                alignItems: "center",
                color: "rgba(255,255,255,0.5)",
                display: "flex",
                fontSize: 17,
                fontWeight: 900,
                justifyContent: "space-between",
                textTransform: "uppercase",
                width: "100%",
              }}
            >
              <div style={{ display: "flex" }}>Matchup</div>
              <div style={{ display: "flex", justifyContent: "center", width: 156 }}>Final</div>
            </div>

            <TeamScoreRow
              accentColor={accentColor}
              colors={colors}
              contextLabel={winner.id === userTeam.id ? "My pick" : "Opponent"}
              highlighted
              role="Winner"
              score={winnerScore}
              team={winner}
            />

            <TeamScoreRow
              accentColor={accentColor}
              colors={colors}
              contextLabel={loser.id === userTeam.id ? "My pick" : "Opponent"}
              role="Beaten"
              score={loserScore}
              team={loser}
            />
          </div>

          <div
            style={{
              alignItems: "center",
              background: "rgba(255,255,255,0.06)",
              border: "2px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              display: "flex",
              height: 82,
              marginTop: 24,
              padding: "0 24px",
              position: "relative",
              width: "100%",
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: hexToRgba(accentColor, 0.16),
                border: `2px solid ${hexToRgba(accentColor, 0.42)}`,
                borderRadius: 8,
                color: "#ffffff",
                display: "flex",
                fontSize: 19,
                fontWeight: 900,
                height: 42,
                justifyContent: "center",
                marginRight: 18,
                textTransform: "uppercase",
                width: 76,
              }}
            >
              MVP
            </div>
            <div
              style={{
                display: "flex",
                flex: 1,
                fontSize: result.mvp.name.length > 21 ? 28 : 32,
                fontWeight: 900,
                lineHeight: 1,
                minWidth: 0,
              }}
            >
              {result.mvp.name}
            </div>
            <div style={{ alignItems: "center", display: "flex", gap: 10 }}>
              <MvpStat label="PTS" value={result.mvp.points} />
              <MvpStat label="REB" value={result.mvp.rebounds} />
              <MvpStat label="AST" value={result.mvp.assists} />
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

function TeamScoreRow({
  accentColor,
  colors,
  contextLabel,
  highlighted = false,
  role,
  score,
  team,
}: {
  accentColor: string;
  colors: TeamColors;
  contextLabel: "My pick" | "Opponent";
  highlighted?: boolean;
  role: "Winner" | "Beaten";
  score: number;
  team: Team;
}) {
  const franchiseSize = getFranchiseFontSize(team.franchise, highlighted);

  return (
    <div
      style={{
        alignItems: "stretch",
        background: highlighted
          ? `linear-gradient(90deg, ${hexToRgba(colors.primary, 0.56)} 0%, ${hexToRgba(colors.primary, 0.24)} 48%, rgba(255,255,255,0.075) 100%)`
          : "rgba(255,255,255,0.045)",
        border: highlighted ? `2px solid ${hexToRgba(accentColor, 0.58)}` : "2px solid rgba(255,255,255,0.11)",
        borderRadius: 8,
        boxShadow: highlighted ? `0 18px 50px ${hexToRgba(colors.primary, 0.25)}` : "none",
        display: "flex",
        height: highlighted ? 138 : 128,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          background: highlighted ? accentColor : hexToRgba(accentColor, 0.45),
          display: "flex",
          width: 10,
        }}
      />

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          minWidth: 0,
          padding: "0 26px",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
          <div
            style={{
              color: highlighted ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0.58)",
              display: "flex",
              fontSize: 19,
              fontWeight: 900,
              textTransform: "uppercase",
            }}
          >
            {role}
          </div>
          <div
            style={{
              background: contextLabel === "My pick" ? hexToRgba(accentColor, 0.22) : "rgba(255,255,255,0.09)",
              border: contextLabel === "My pick" ? `2px solid ${hexToRgba(accentColor, 0.45)}` : "2px solid rgba(255,255,255,0.12)",
              borderRadius: 6,
              color: "rgba(255,255,255,0.88)",
              display: "flex",
              fontSize: 16,
              fontWeight: 900,
              padding: "5px 10px",
              textTransform: "uppercase",
            }}
          >
            {contextLabel}
          </div>
        </div>

        <div
          style={{
            color: highlighted ? "rgba(255,255,255,0.66)" : "rgba(255,255,255,0.5)",
            display: "flex",
            fontSize: 22,
            fontWeight: 800,
            marginTop: 8,
          }}
        >
          {team.season}
        </div>
        <div
          style={{
            color: "#ffffff",
            display: "flex",
            fontSize: franchiseSize,
            fontWeight: 900,
            lineHeight: 1,
            marginTop: 4,
            whiteSpace: "nowrap",
          }}
        >
          {team.franchise}
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          background: highlighted ? "rgba(255,255,255,0.93)" : "rgba(255,255,255,0.075)",
          borderLeft: "2px solid rgba(255,255,255,0.12)",
          color: highlighted ? "#0d0d0f" : "rgba(255,255,255,0.82)",
          display: "flex",
          fontSize: highlighted ? 74 : 64,
          fontWeight: 900,
          justifyContent: "center",
          width: 156,
        }}
      >
        {score}
      </div>
    </div>
  );
}

function MvpStat({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "rgba(255,255,255,0.08)",
        border: "2px solid rgba(255,255,255,0.12)",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        height: 50,
        justifyContent: "center",
        width: 88,
      }}
    >
      <div style={{ color: "#ffffff", display: "flex", fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.58)", display: "flex", fontSize: 12, fontWeight: 900, marginTop: 3 }}>{label}</div>
    </div>
  );
}

function scoreForTeam(teamId: string, teamAId: string, teamAScore: number, teamBScore: number) {
  return teamId === teamAId ? teamAScore : teamBScore;
}

function getFranchiseFontSize(franchise: string, highlighted: boolean) {
  if (franchise.length > 22) {
    return highlighted ? 44 : 38;
  }

  if (franchise.length > 18) {
    return highlighted ? 48 : 40;
  }

  return highlighted ? 54 : 44;
}

function getVisibleAccent(colors: TeamColors) {
  return [colors.primary, colors.secondary, colors.accent].find((color) => getLuminance(color) > 45) ?? "#f8fafc";
}

function getLuminance(hex: string) {
  const rgb = parseHex(hex);

  if (!rgb) {
    return 255;
  }

  return 0.2126 * rgb.red + 0.7152 * rgb.green + 0.0722 * rgb.blue;
}

function hexToRgba(hex: string, alpha: number) {
  const rgb = parseHex(hex);

  if (!rgb) {
    return `rgba(255,255,255,${alpha})`;
  }

  return `rgba(${rgb.red},${rgb.green},${rgb.blue},${alpha})`;
}

function parseHex(hex: string) {
  const value = hex.replace("#", "");

  if (value.length !== 6) {
    return null;
  }

  const numeric = Number.parseInt(value, 16);

  if (Number.isNaN(numeric)) {
    return null;
  }

  return {
    red: (numeric >> 16) & 255,
    green: (numeric >> 8) & 255,
    blue: numeric & 255,
  };
}
