"use client";

import { useEffect, useState } from "react";

type Stats = { count_mutant_dna: number; count_human_dna: number; ratio: number };
type Result = { kind: "mutant" | "human" | "error"; message: string } | null;

const SIZE = 6;
const LETTERS = "ATCG";
const emptyGrid = () =>
  Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => ""));
const randomGrid = () =>
  Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]),
  );

export default function Home() {
  const [grid, setGrid] = useState<string[][]>(emptyGrid);
  const [result, setResult] = useState<Result>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [busy, setBusy] = useState(false);

  async function refreshStats() {
    const res = await fetch("/api/stats");
    if (res.ok) setStats(await res.json());
  }

  useEffect(() => {
    refreshStats();
  }, []);

  function setCell(r: number, c: number, value: string) {
    const v = value.toUpperCase().replace(/[^ATCG]/g, "").slice(0, 1);
    setGrid((g) => g.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row)));
  }

  async function submit() {
    const dna = grid.map((row) => row.join(""));
    if (dna.some((row) => row.length !== SIZE)) {
      setResult({ kind: "error", message: "Please fill every cell with A, T, C, or G." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/mutant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dna }),
      });
      if (res.status === 200) setResult({ kind: "mutant", message: "Mutant detected 🧬" });
      else if (res.status === 403) setResult({ kind: "human", message: "Human (not a mutant)" });
      else setResult({ kind: "error", message: "Invalid DNA input." });
      await refreshStats();
    } catch {
      setResult({ kind: "error", message: "Could not reach the server. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h1>Mutant DNA Detector</h1>
      <p>Enter a {SIZE}×{SIZE} DNA grid using only A, T, C, G.</p>

      <div className="grid" style={{ gridTemplateColumns: `repeat(${SIZE}, 2.5rem)` }}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <input
              key={`${r}-${c}`}
              value={cell}
              maxLength={1}
              onChange={(e) => setCell(r, c, e.target.value)}
              aria-label={`row ${r + 1} column ${c + 1}`}
            />
          )),
        )}
      </div>

      <div className="controls">
        <button onClick={submit} disabled={busy}>{busy ? "Checking…" : "Check DNA"}</button>
        <button onClick={() => { setGrid(randomGrid()); setResult(null); }}>Random</button>
        <button onClick={() => { setGrid(emptyGrid()); setResult(null); }}>Clear</button>
      </div>

      {result && <p className={`result ${result.kind}`}>{result.message}</p>}

      {stats && (
        <div className="stats">
          <strong>API stats</strong>
          <div>Mutant DNA: {stats.count_mutant_dna}</div>
          <div>Human DNA: {stats.count_human_dna}</div>
          <div>Ratio: {stats.ratio}</div>
        </div>
      )}
    </main>
  );
}
