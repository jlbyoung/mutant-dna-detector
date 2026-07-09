import { createHash } from "node:crypto";

/**
 * Deterministic sha256 hex digest of a DNA matrix. Rows are joined with a
 * newline (a character outside the A/T/C/G alphabet) so distinct row splits
 * never collide.
 */
export function hashDna(dna: string[]): string {
  return createHash("sha256").update(dna.join("\n")).digest("hex");
}
