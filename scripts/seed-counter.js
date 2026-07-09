// Ensures the single stats_counters row (id = 1) exists. Idempotent.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.statsCounter.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, mutantCount: 0n, humanCount: 0n },
  });
  console.log("stats_counters row ensured");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
