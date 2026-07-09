-- CreateTable
CREATE TABLE "dna_records" (
    "dna_hash" TEXT NOT NULL,
    "is_mutant" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dna_records_pkey" PRIMARY KEY ("dna_hash")
);

-- CreateTable
CREATE TABLE "stats_counters" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "mutant_count" BIGINT NOT NULL DEFAULT 0,
    "human_count" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "stats_counters_pkey" PRIMARY KEY ("id")
);
