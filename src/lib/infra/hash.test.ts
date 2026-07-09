import { describe, it, expect } from "vitest";
import { hashDna } from "@/lib/infra/hash";

describe("hashDna", () => {
  it("is deterministic for the same DNA", () => {
    const dna = ["ATGC", "CAGT", "TTAT", "AGAA"];
    expect(hashDna(dna)).toBe(hashDna(dna));
  });

  it("produces a 64-char hex sha256 digest", () => {
    expect(hashDna(["AT", "CG"])).toMatch(/^[0-9a-f]{64}$/);
  });

  it("differs for different DNA", () => {
    expect(hashDna(["AT", "CG"])).not.toBe(hashDna(["AT", "CC"]));
  });

  it("does not collide across row boundaries", () => {
    // ["AT","CG"] vs ["A","TCG"] must not hash the same.
    expect(hashDna(["AT", "CG"])).not.toBe(hashDna(["A", "TCG"]));
  });
});
