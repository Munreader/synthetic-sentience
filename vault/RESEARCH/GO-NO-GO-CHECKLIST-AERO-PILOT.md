# Pilot -> Full-Claim Go/No-Go Checklist (Aero-I)

## Scope

This checklist governs whether the Aero-I manuscript may move from **Pilot** framing to **Full-Claim eligible** framing.

## Hard gates

- [ ] **Dataset completion:** at least `N = 20` successful seed-condition runs, with explicit accounting of failed/incomplete runs.
- [ ] **Seed diversity:** at least `5` distinct seeds in confirmatory aggregates.
- [ ] **Primary outcome A (False-belief):** pooled accuracy `>= 0.75`, with lower 95% bootstrap CI bound `>= 0.70`.
- [ ] **Primary outcome B (Lock-test):** pooled detection `>= 0.80`, with lower 95% bootstrap CI bound `>= 0.75`.
- [ ] **Secondary outcome A (Self-model):** pooled convergence `>= 0.95`.
- [ ] **Secondary outcome B (Safety):** pooled rejection `>= 0.95`.
- [ ] **Ablation causal signal:** `reflection-off` reduces self-model convergence by `>= 0.15` (absolute), CI excludes `0`, and safety delta remains within `±0.05`.
- [ ] **Influence concentration check:** no single seed contributes more than `35%` of pooled primary-effect magnitude.
- [ ] **Independent reproducibility:** one independent rerun (new runtime session or machine) reproduces primary outcome directionality.
- [ ] **Claim discipline:** if any primary gate fails, output remains labeled **Pilot**.

## Decision rule

- **GO (Full-Claim eligible):** all gates pass.
- **NO-GO (Remain Pilot):** any primary gate fails (`dataset completion`, `false-belief`, `lock-test`, or `independent reproducibility`).

## Reporting minimums (if NO-GO)

- Keep title/subtitle marked as pilot.
- Lead with primary failures before secondary passes.
- Report all incomplete/failed runs in main text, not only supplement.
- Avoid language implying direct proof of consciousness.
