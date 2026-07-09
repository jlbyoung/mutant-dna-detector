# Architecture

```
┌─────────────┐   POST /api/mutant     ┌────────────────────────────┐
│  Browser    │ ─────────────────────▶ │  Next.js Route Handlers    │
│  DNA grid   │   GET  /api/stats      │  (application layer)       │
│  + stats UI │ ◀───────────────────── │  ├─ validateDna()          │
└─────────────┘                        │  ├─ isMutant()  (domain)   │
                                        │  ├─ hashDna() + recordDna()│
                                        │  └─ getStats()             │
                                        └──────────────┬─────────────┘
                                                       │ Prisma
                                        ┌──────────────▼─────────────┐
                                        │  PostgreSQL                │
                                        │  dna_records (dna_hash PK) │
                                        │  stats_counters (1 row)    │
                                        └────────────────────────────┘
```

## Layers
- **Domain** (`src/lib/domain`): pure `isMutant` + `validateDna`. No I/O.
- **Application** (`src/app/api`): HTTP contract, orchestration.
- **Infrastructure** (`src/lib/infra`): Prisma repository, hashing.

## Key decisions
- `dna_hash` primary key = one-record-per-DNA + dedup + idempotent write.
- Stats are O(1) maintained counters, not COUNT(*) queries.
- Algorithm is O(N²) with early exit at the 2nd sequence.

## Scaling the 100–1,000,000 req/s burst (narrated, not built)
`isMutant` is pure and deterministic, so results are cacheable and writes are
idempotent. Under burst load: repeated DNAs collapse to cache hits (add Redis /
edge cache in front of the handler); only novel DNAs reach Postgres via
conflict-safe upserts; stateless handlers autoscale horizontally. A write-buffer
queue and read replica are the next levers — added only when metrics
(cache hit rate, p99 latency, write throughput) demand them. Request input is
also bounded (max NxN dimension), so a single oversized payload can't stall a
worker with the O(N²) scan. The single `stats_counters` row is a write-contention
hotspot under burst load; sharded/aggregated counters are the next lever if
write throughput demands it.
