import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/infra/prisma";

/**
 * Persists a DNA verification exactly once. The dna_hash primary key enforces
 * one-record-per-DNA; a unique-violation means it was already recorded, so we
 * treat the call as an idempotent no-op and do NOT touch the counters. The
 * insert + counter increment run in one transaction so they cannot diverge.
 */
export async function recordDna(dnaHash: string, mutant: boolean): Promise<void> {
  try {
    // Idempotency relies on the dna_hash PK: a concurrent duplicate insert blocks
    // on the unique index and then fails with P2002 (under READ COMMITTED), so the
    // counter is incremented exactly once. Prisma does not auto-retry interactive
    // transactions, so there is no double-count.
    await prisma.$transaction(async (tx) => {
      await tx.dnaRecord.create({ data: { dnaHash, isMutant: mutant } });
      await tx.statsCounter.update({
        where: { id: 1 },
        data: mutant
          ? { mutantCount: { increment: 1 } }
          : { humanCount: { increment: 1 } },
      });
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return; // already recorded — idempotent no-op
    }
    throw e;
  }
}

export interface Stats {
  count_mutant_dna: number;
  count_human_dna: number;
  ratio: number;
}

export async function getStats(): Promise<Stats> {
  const counter = await prisma.statsCounter.findUnique({ where: { id: 1 } });
  const mutant = Number(counter?.mutantCount ?? 0n);
  const human = Number(counter?.humanCount ?? 0n);
  return {
    count_mutant_dna: mutant,
    count_human_dna: human,
    ratio: human === 0 ? 0 : mutant / human,
  };
}
