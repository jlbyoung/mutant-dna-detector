# Mutant DNA Detector

Detects whether a DNA sequence belongs to a mutant: more than one sequence of
four identical letters (horizontal, vertical, or diagonal).

## Run with Docker (recommended)

```bash
cp .env.example .env
docker compose up --build
```
Open http://localhost:3000. The app runs migrations and seeds the stats counter
on startup.

## Run locally (dev)

```bash
cp .env.example .env
docker compose up -d postgres
npm install
npx prisma migrate dev --name init
node scripts/seed-counter.js
npm run dev
```

## API

`POST /mutant` → `200` mutant, `403` human, `400` malformed
```json
{ "dna": ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"] }
```

`GET /stats`
```json
{ "count_mutant_dna": 40, "count_human_dna": 100, "ratio": 0.4 }
```

## Tests & coverage

```bash
docker compose up -d postgres   # repository integration tests need Postgres
npm run coverage
```

## Notes / decisions
- "More than one" means **≥ 2** sequences; a single run of four is not a mutant.
- Overlapping windows count separately (a run of 5 = 2 sequences).
- One record per DNA is enforced by the `dna_hash` primary key (idempotent writes).
- See `docs/architecture.md` for the diagram and the scaling rationale.
