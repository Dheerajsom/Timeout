import { PrismaClient } from "@prisma/client";
import { teams } from "../lib/teams";

const prisma = new PrismaClient();

async function main() {
  for (const team of teams) {
    await prisma.team.upsert({
      where: { id: team.id },
      update: {
        name: team.name,
        franchise: team.franchise,
        season: team.season,
        wins: team.wins,
        losses: team.losses,
        pace: team.pace,
        offense: team.offense,
        defense: team.defense,
        spacing: team.spacing,
        rimPressure: team.rimPressure,
        rebounding: team.rebounding,
        playmaking: team.playmaking,
        starPower: team.starPower,
        benchDepth: team.benchDepth,
        clutch: team.clutch,
        physicality: team.physicality,
        styleSummary: team.styleSummary,
        players: {
          deleteMany: {},
          create: team.players.map(({ id: _id, teamId: _teamId, ...player }) => player),
        },
      },
      create: {
        id: team.id,
        name: team.name,
        franchise: team.franchise,
        season: team.season,
        wins: team.wins,
        losses: team.losses,
        pace: team.pace,
        offense: team.offense,
        defense: team.defense,
        spacing: team.spacing,
        rimPressure: team.rimPressure,
        rebounding: team.rebounding,
        playmaking: team.playmaking,
        starPower: team.starPower,
        benchDepth: team.benchDepth,
        clutch: team.clutch,
        physicality: team.physicality,
        styleSummary: team.styleSummary,
        players: {
          create: team.players.map(({ id: _id, teamId: _teamId, ...player }) => player),
        },
      },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
