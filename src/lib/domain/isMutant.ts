const SEQUENCE_LENGTH = 4;

// Only forward directions, so each sequence is counted exactly once:
// horizontal →, vertical ↓, diagonal ↘, anti-diagonal ↙.
const DIRECTIONS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

/**
 * Returns true if `dna` contains MORE THAN ONE (>= 2) sequence of four
 * consecutive identical letters in any direction. Overlapping windows count
 * separately. O(N^2) time, O(1) extra space, with early exit at the 2nd hit.
 */
export function isMutant(dna: string[]): boolean {
  const n = dna.length;
  let sequences = 0;

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      for (const [dr, dc] of DIRECTIONS) {
        if (hasSequenceAt(dna, n, r, c, dr, dc)) {
          sequences++;
          if (sequences > 1) return true; // early exit
        }
      }
    }
  }
  return false;
}

function hasSequenceAt(
  dna: string[],
  n: number,
  r: number,
  c: number,
  dr: number,
  dc: number,
): boolean {
  const endR = r + dr * (SEQUENCE_LENGTH - 1);
  const endC = c + dc * (SEQUENCE_LENGTH - 1);
  if (endR < 0 || endR >= n || endC < 0 || endC >= n) return false;

  const letter = dna[r][c];
  for (let k = 1; k < SEQUENCE_LENGTH; k++) {
    if (dna[r + dr * k][c + dc * k] !== letter) return false;
  }
  return true;
}
