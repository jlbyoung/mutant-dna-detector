import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/infra/prisma";
import { recordDna, getStats } from "@/lib/infra/repository";

async function reset() {
  await prisma.dnaRecord.deleteMany();
  await prisma.statsCounter.upsert({
    where: { id: 1 },
    update: { mutantCount: 0n, humanCount: 0n },
    create: { id: 1, mutantCount: 0n, humanCount: 0n },
  });
}

describe("repository (integration)", () => {
  beforeEach(reset);
  afterAll(() => prisma.$disconnect());

  it("records a mutant and increments the mutant counter", async () => {
    await recordDna("hash-m", true);
    expect(await getStats()).toEqual({
      count_mutant_dna: 1,
      count_human_dna: 0,
      ratio: 0,
    });
  });

  it("records a human and computes ratio mutant/human", async () => {
    await recordDna("hash-m", true);
    await recordDna("hash-h", false);
    expect(await getStats()).toEqual({
      count_mutant_dna: 1,
      count_human_dna: 1,
      ratio: 1,
    });
  });

  it("is idempotent: the same hash recorded twice stores one record and counts once", async () => {
    await recordDna("hash-dup", true);
    await recordDna("hash-dup", true);
    const count = await prisma.dnaRecord.count();
    expect(count).toBe(1);
    expect((await getStats()).count_mutant_dna).toBe(1);
  });

  it("returns ratio 0 when there are no humans", async () => {
    await recordDna("hash-only-mutant", true);
    expect((await getStats()).ratio).toBe(0);
  });
});
