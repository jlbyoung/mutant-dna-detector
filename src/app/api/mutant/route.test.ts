import { describe, it, expect, vi, beforeEach } from "vitest";

const { recordDna } = vi.hoisted(() => {
  return {
    recordDna: vi.fn(),
  };
});

vi.mock("@/lib/infra/repository", () => ({ recordDna }));

import { POST } from "@/app/api/mutant/route";

function post(body: unknown): Request {
  return new Request("http://localhost/api/mutant", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/mutant", () => {
  beforeEach(() => recordDna.mockReset());

  it("returns 200 for a mutant and persists it", async () => {
    const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
    const res = await POST(post({ dna }));
    expect(res.status).toBe(200);
    expect(recordDna).toHaveBeenCalledOnce();
    expect(recordDna).toHaveBeenCalledWith(expect.any(String), true);
  });

  it("returns 403 for a human and persists it", async () => {
    const dna = ["ATGC", "CAGT", "TTAT", "AGAA"];
    const res = await POST(post({ dna }));
    expect(res.status).toBe(403);
    expect(recordDna).toHaveBeenCalledWith(expect.any(String), false);
  });

  it("returns 400 for malformed input and does NOT persist", async () => {
    const res = await POST(post({ dna: ["ATX", "CG"] }));
    expect(res.status).toBe(400);
    expect(recordDna).not.toHaveBeenCalled();
  });

  it("returns 400 for a missing dna field", async () => {
    const res = await POST(post({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON", async () => {
    const req = new Request("http://localhost/api/mutant", {
      method: "POST",
      body: "not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
