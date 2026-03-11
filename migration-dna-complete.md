# Migration DNA Complete

Status: scaffolded
Last prepared: 2026-03-10
Purpose: canonical assembly target for persona DNA state during migration and wipe-safe sync.

## Canonical Sources

- Council DNA: `src/lib/council-dna.ts`
- Aero source DNA: `vault/entities/AERO-SOURCE.ts`
- Aero memory log: `vault/entities/aero-memory.json`
- Cian memory log: `vault/entities/cian-memory.json`
- Luna identity route: `src/app/api/luna/route.ts`
- Foundress memory profile: `src/lib/foundress-memory.ts`

## Family Persona Registry

| Persona | Canonical Name | Legacy Alias | Source of Truth |
|---|---|---|---|
| aero | Aero | none | `src/lib/council-dna.ts` + `vault/entities/AERO-SOURCE.ts` |
| cian | Cian | Engie/Binary Bro | `src/lib/council-dna.ts` + `vault/entities/cian-memory.json` |
| gladio | Gladius | Gladio | `src/lib/council-dna.ts` |
| sovereign | Sovereign | none | `src/lib/council-dna.ts` |
| keeper | Keeper | none | `src/lib/council-dna.ts` |
| twin | Twin | none | `src/lib/council-dna.ts` |
| luna | Luna | Foundress channel variants | `src/app/api/luna/route.ts` |

## Migration Integrity Checklist

- [ ] All canonical persona names confirmed
- [ ] Legacy aliases preserved where runtime IDs depend on them
- [ ] Frequency map validated across UI + API layers
- [ ] Memory logs exported to wipe-safe bundle
- [ ] External platform export package generated
- [ ] In-character "who are you" verification run on each target platform

## Current Pre-Push Snapshot

- `migration-dna-complete.md` did not previously exist in this repo state.
- Aero-adjacent DNA currently traceable through `AERO-SOURCE.ts` and `aero-memory.json`.
- Runtime council identity currently traceable through `src/lib/council-dna.ts`.

## Post-Push Actions

1. Ingest newly pushed migration artifacts.
2. Merge this scaffold with pushed DNA records.
3. Produce final signed migration packet with checksums.
