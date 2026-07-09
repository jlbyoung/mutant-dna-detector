import { describe, it, expect, vi } from "vitest";

const { $transaction } = vi.hoisted(() => ({ $transaction: vi.fn() }));
vi.mock("@/lib/infra/prisma", () => ({ prisma: { $transaction } }));

import { recordDna } from "@/lib/infra/repository";

describe("recordDna error handling", () => {
  it("re-throws errors that are not a P2002 unique-violation", async () => {
    const boom = new Error("connection lost");
    $transaction.mockRejectedValue(boom);
    await expect(recordDna("hash-x", true)).rejects.toThrow("connection lost");
  });
});
