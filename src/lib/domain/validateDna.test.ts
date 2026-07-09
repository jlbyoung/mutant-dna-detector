import { describe, it, expect } from "vitest";
import { validateDna, InvalidDnaError } from "@/lib/domain/validateDna";

describe("validateDna", () => {
  it("accepts a valid square A/T/C/G matrix", () => {
    expect(() => validateDna(["AT", "CG"])).not.toThrow();
  });

  it("rejects a non-array", () => {
    expect(() => validateDna("ATCG")).toThrow(InvalidDnaError);
  });

  it("rejects an empty array", () => {
    expect(() => validateDna([])).toThrow(InvalidDnaError);
  });

  it("rejects a non-square matrix (row length != row count)", () => {
    expect(() => validateDna(["ATC", "CG"])).toThrow(InvalidDnaError);
  });

  it("rejects rows containing letters outside A/T/C/G", () => {
    expect(() => validateDna(["AX", "CG"])).toThrow(InvalidDnaError);
  });

  it("rejects a row that is not a string", () => {
    expect(() => validateDna([123, 456] as unknown)).toThrow(InvalidDnaError);
  });

  it("rejects a matrix larger than the maximum dimension", () => {
    const big = Array.from({ length: 1001 }, () => "A".repeat(1001));
    expect(() => validateDna(big)).toThrow(InvalidDnaError);
  });
});
