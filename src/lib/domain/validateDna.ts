export class InvalidDnaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidDnaError";
  }
}

const VALID_ROW = /^[ATCG]+$/;
const MAX_DIMENSION = 1000;

/**
 * Validates that `dna` is a non-empty, square NxN matrix of strings whose
 * characters are only A, T, C, G. Throws InvalidDnaError otherwise.
 */
export function validateDna(dna: unknown): asserts dna is string[] {
  if (!Array.isArray(dna) || dna.length === 0) {
    throw new InvalidDnaError("dna must be a non-empty array of strings");
  }
  const n = dna.length;
  if (n > MAX_DIMENSION) {
    throw new InvalidDnaError(`dna matrix dimension ${n} exceeds the maximum of ${MAX_DIMENSION}`);
  }
  for (const row of dna) {
    if (typeof row !== "string" || row.length !== n) {
      throw new InvalidDnaError("dna must be a square NxN matrix of equal-length strings");
    }
    if (!VALID_ROW.test(row)) {
      throw new InvalidDnaError("dna may only contain the letters A, T, C, G");
    }
  }
}
