// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      if (String(url).includes("/stats")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ count_mutant_dna: 1, count_human_dna: 1, ratio: 1 }),
        });
      }
      return Promise.resolve({ status: 200 }); // POST /mutant -> mutant
    }) as unknown as typeof fetch,
  );
});

describe("Home page", () => {
  it("renders a 6x6 grid and the stats panel", async () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /mutant dna detector/i })).toBeTruthy();
    expect(screen.getAllByRole("textbox")).toHaveLength(36);
    await waitFor(() => expect(screen.getByText(/Mutant DNA: 1/)).toBeTruthy());
  });

  it("fills via Random and reports a mutant on check", async () => {
    render(<Home />);
    await screen.findByText(/Mutant DNA: 1/); // let the mount stats fetch settle
    fireEvent.click(screen.getByRole("button", { name: /random/i }));
    fireEvent.click(screen.getByRole("button", { name: /check dna/i }));
    await waitFor(() => expect(screen.getByText(/Mutant detected/i)).toBeTruthy());
  });

  it("clears the grid", async () => {
    render(<Home />);
    await screen.findByText(/Mutant DNA: 1/); // let the mount stats fetch settle
    fireEvent.click(screen.getByRole("button", { name: /random/i }));
    fireEvent.click(screen.getByRole("button", { name: /clear/i }));
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    expect(inputs.every((i) => i.value === "")).toBe(true);
  });
});
