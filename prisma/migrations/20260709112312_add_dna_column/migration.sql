/*
  Warnings:

  - Added the required column `dna` to the `dna_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dna_records" ADD COLUMN     "dna" TEXT NOT NULL;
