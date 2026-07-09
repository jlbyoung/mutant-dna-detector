import { describe, it, expect, vi } from "vitest";

const { getStats } = vi.hoisted(() => ({ getStats: vi.fn() }));
vi.mock("@/lib/infra/repository", () => ({ getStats }));

import { GET } from "@/app/stats/route";

describe("GET /stats", () => {
  it("returns the stats payload as JSON", async () => {
    getStats.mockResolvedValue({ count_mutant_dna: 40, count_human_dna: 100, ratio: 0.4 });
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      count_mutant_dna: 40,
      count_human_dna: 100,
      ratio: 0.4,
    });
  });
});
