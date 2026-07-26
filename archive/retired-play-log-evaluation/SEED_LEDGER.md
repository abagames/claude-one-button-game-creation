# Seed Ledger

The record of which seed pools have been used, by game and evaluation ID. This is a correctness artifact, not
bookkeeping: an analysis pool is **burned** once episodes have run against it, and drawing a burned pool again
would break the freeze that makes a result a measurement rather than a retry.

Normative rules live in [WORKFLOW.md](WORKFLOW.md) Stages 8-9 and [AGENTS.md](AGENTS.md). This file is the
single place where consumption is recorded.

## Allocation rule

A pool is identified by a pool number `P`, and expands to the seeds `P*1000 + 1 … P*1000 + n` for a pool of
size `n` (`n = 5` in every round so far). Pool 93 is therefore `93001 … 93005`.

- **Analysis pools are burned.** At the Stage 8 freeze, take the **lowest unused analysis pool number**, write
  its seeds into `seed_plan.analysis`, and append the row to the game's table below **in the same change that
  freezes the plan** — not after the round runs. A pool is burned from the moment it is written into a frozen
  plan, whether or not the round completed, and whether or not the round failed technically. A technically
  failed round does not return its pool: per [CONTRACTS.md](CONTRACTS.md), the re-run is a new evaluation ID
  with a new pool.
- **Development pools are declared, not burned.** One pool per game, reused freely across that game's rounds
  and across re-runs. They are listed below so that a development pool is never handed out as an analysis pool.
- Pool numbers are global across games. Two games must not share an analysis pool, because the point of the
  record is that any given result can be traced to seeds no other result used.

**Next free analysis pool: 101.**

## Development pools

One per game, fixed for the seven-game run.

| game | development pool | seeds |
| --- | --- | --- |
| `bore-comet` | 51 | 51001-51005 |
| `bridgecross` | 52 | 52001-52005 |
| `bladedancer` | 53 | 53001-53005 |
| `cleaner` | 54 | 54001-54005 |
| `pulse-stream` | 55 | 55001-55005 |
| `feedingfrenzy` | 56 | 56001-56005 |
| `hoardspout` | 57 | 57001-57005 |

Pools 58-60 and 62-70 are unallocated and are reserved for development use by later games, so that analysis
allocation can continue upward from 95 without ever meeting them.

## Burned analysis pools

### `bore-comet`

| pool | seeds | evaluation ID | instrument version | outcome |
| --- | --- | --- | --- | --- |
| 61 | 61001-61005 | `docs-v1` | superseded | provenance only; not comparable to `docs-v6` onward |
| 71 | 71001-71005 | `docs-v2` | superseded | provenance only |
| 81 | 81001-81005 | `docs-v3` | superseded | provenance only |
| 91 | 91001-91005 | `docs-v4` | superseded | provenance only |
| 92 | 92001-92005 | `docs-v5` | superseded | provenance only |
| 93 | 93001-93005 | `docs-v6` | current | round of record: `completed` 16/20 `[2,1,2,1]` |
| 94 | 94001-94005 | `docs-v7` | current | stability replication: `completed` 16/20 `[2,1,2,1]` |

`docs-v8` (the Phase B re-run under the frozen ranking contract, per `BACKLOG.md`) will take the lowest unused
pool at its freeze.

### `bridgecross`

| pool | seeds | evaluation ID | instrument version | outcome |
| --- | --- | --- | --- | --- |
| 95 | 95001-95005 | `docs-v8` | current | frozen into the Stage 8 plan 2026-07-26; Phase A passed the feasibility gate with `analysis_seed_accessed: false`, so no episode has run on these seeds yet. They are burned regardless: the pool is fixed in a frozen plan |

### `bladedancer`

| pool | seeds | evaluation ID | instrument version | outcome |
| --- | --- | --- | --- | --- |
| 96 | 96001-96005 | `docs-v8` | current | frozen into the Stage 8 plan 2026-07-26; Phase A passed the feasibility gate with `analysis_seed_accessed: false`, so no episode has run on these seeds yet. They are burned regardless: the pool is fixed in a frozen plan |

### `cleaner`

| pool | seeds | evaluation ID | instrument version | outcome |
| --- | --- | --- | --- | --- |
| 97 | 97001-97005 | `docs-v8` | current | frozen into the Stage 8 plan 2026-07-26; Phase A passed the feasibility gate with `analysis_seed_accessed: false`, so no episode has run on these seeds yet. They are burned regardless: the pool is fixed in a frozen plan |

### `pulse-stream`

| pool | seeds | evaluation ID | instrument version | outcome |
| --- | --- | --- | --- | --- |
| 98 | 98001-98005 | `docs-v8` | current | frozen into the Stage 8 plan 2026-07-26, then the game **stopped at the development-only feasibility gate** as `instrument_insufficient`. No episode ran on these seeds and none ever will, but the pool stays burned: it was fixed in a frozen plan, and the ledger rule does not return a pool because the round ended early |

### `feedingfrenzy`

| pool | seeds | evaluation ID | instrument version | outcome |
| --- | --- | --- | --- | --- |
| 99 | 99001-99005 | `docs-v8` | current | frozen into the Stage 8 plan 2026-07-26, then the game **stopped at the development-only feasibility gate** as `instrument_insufficient`. No episode ran on these seeds and none ever will; the pool stays burned for the same reason as `pulse-stream`'s pool 98 |

### `hoardspout`

| pool | seeds | evaluation ID | instrument version | outcome |
| --- | --- | --- | --- | --- |
| 100 | 100001-100005 | `docs-v8` | current | frozen into the Stage 8 plan 2026-07-26, then the game **stopped at the development-only feasibility gate** as `instrument_insufficient`. No episode ran on these seeds and none ever will; the pool stays burned for the same reason as pools 98 and 99 |

Note that pool 100 is the first pool whose seeds are six digits (`100001`…). The allocation rule `P*1000 + n`
has no upper bound and seeds are only ever compared for equality, so nothing depends on the width — but a
reader scanning for five-digit seeds should not conclude the table stops at 99.
