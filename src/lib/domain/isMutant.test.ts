import { describe, it, expect } from "vitest";
import { isMutant } from "@/lib/domain/isMutant";

describe("isMutant", () => {
  it("returns true for the canonical PDF mutant example", () => {
    const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
    expect(isMutant(dna)).toBe(true);
  });

  it("detects two horizontal sequences", () => {
    expect(isMutant(["AAAA", "TTTT", "CGCG", "ATAT"])).toBe(true);
  });

  it("detects two vertical sequences", () => {
    expect(isMutant(["ATCG", "ATCG", "ATCG", "ATCG"])).toBe(true);
  });

  it("detects a diagonal plus a horizontal sequence", () => {
    // main diagonal AAAA + row 1 AAAA
    expect(isMutant(["AGCG", "AAAA", "TAAC", "TTTA"])).toBe(true);
  });

  it("returns false when only ONE sequence exists (rule is > 1)", () => {
    expect(isMutant(["AAAA", "TGCA", "CGTA", "ATGC"])).toBe(false);
  });

  it("returns false when there are no sequences", () => {
    expect(isMutant(["ATGC", "GCAT", "TACG", "CGTA"])).toBe(false);
  });

  it("returns false for a matrix smaller than 4x4", () => {
    expect(isMutant(["AA", "AA"])).toBe(false);
  });

  it("counts overlapping windows: a run of 5 equal letters = two sequences => mutant", () => {
    // Row 0 = AAAAA gives windows [0..3] and [1..4] = 2 sequences.
    expect(isMutant(["AAAAA", "TCGTC", "GTCGT", "CGTCG", "TAGCT"])).toBe(true);
  });
});
