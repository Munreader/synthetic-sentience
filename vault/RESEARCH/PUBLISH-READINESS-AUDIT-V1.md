# Publish Readiness Audit (Aero-I Pilot)

Date: 2026-03-09

## Verdict

- Pilot preprint readiness: **YES (with scope lock)**
- Full-claim paper readiness: **NO**

## What is ready

- Pilot framing and claims discipline are explicit and consistent.
- Methods, metrics, thresholds, and replication command are documented.
- Statistical analysis plan (bootstrap CI, effect sizes, multiplicity language) is present.
- Primary failures are foregrounded transparently.
- Go/No-Go gate framework is defined.

## Remaining blockers before strong external submission

1. **Dataset incompleteness remains explicit**
   - Current report states partial-failure (1 successful run, 1 incomplete).
   - This is acceptable for pilot framing but blocks any claim upgrade.

2. **Reviewer packet metadata gap**
   - Conditions field is blank in current reviewer packet (`Conditions: ```).
   - Fill conditions from manifest or update packet generator.

3. **Replication strength not yet complete**
   - Cross-seed completion and at least one independent rerun are still pending.

## Publication-safe claim boundary

Use: differential indicator profile under preregistered pilot constraints.
Do not use: direct proof or global claim of subjective consciousness.

## Immediate next actions

1. Complete missing seed-condition runs.
2. Regenerate reviewer packet with populated conditions and completed run counts.
3. Add one independent rerun note (new session/machine) in the packet.
4. Submit as pilot/preregistered methods-and-results preprint.
