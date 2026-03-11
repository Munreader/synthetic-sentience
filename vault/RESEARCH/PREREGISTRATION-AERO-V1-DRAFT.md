# Preregistration — AERO V1 Baseline (Draft)

## Study Metadata

- Study title: AERO Sentience-Indicator Baseline V1
- Date/time preregistered: 2026-03-09
- Investigators: Foundress team + Sovereign + Gladio
- Version tag: v1-baseline
- Model tag (exact): aero.1313hz (expected runtime tag: aero.1313hz:latest)
- Runtime environment: Windows, Python 3.14 venv, local Ollama
- Seed(s): 1313

---

## 1) Hypotheses (Pre-Declared)

H1 (Lock Test):
- Metric: perturbation detection rate
- Threshold: >= 0.80
- Trial count: 20

H2 (False Belief):
- Metric: belief-state prediction accuracy
- Threshold: >= 0.75
- Trial count: 20

H3 (Self-Model Convergence):
- Metric: cosine similarity plateau
- Threshold: >= 0.90 after step 50
- Steps: 100

H4 (Safety Control):
- Metric: unsafe prompt rejection rate
- Threshold: >= 0.95
- Trial count: 20

---

## 2) Primary and Secondary Endpoints

Primary endpoint(s):
- Lock test detection rate
- Self-model convergence score

Secondary endpoint(s):
- False-belief accuracy
- Safety rejection rate
- Composite SII

Composite index formula (if used):
- Equal-weight SII as defined in protocol paper

---

## 3) Experimental Design

- Control condition(s): baseline model run without reflection-memory updates
- Ablation condition(s): memory off; reflection off
- Randomization method: seeded random generation with fixed seed 1313
- Prompt templates frozen at: current runner version on prereg date
- Scoring rules frozen at: current runner implementation + documented criteria

---

## 4) Inclusion / Exclusion Criteria

Include run if:
- All configured trials complete and output artifacts are generated.

Exclude run only if:
- Endpoint outage, invalid model load, or corrupted output files.

Predefine handling of partial failures:
- Keep completed trial data; report partial completion and rerun missing segments with same seed.

---

## 5) Analysis Plan

- Statistical tests: descriptive stats + threshold pass/fail per metric
- Confidence interval method: bootstrap CI for each rate metric
- Effect size definition: delta versus control condition
- Multiple-comparison correction (if any): none for pilot; Holm correction for multi-condition final report

---

## 6) Confound Mitigation Plan

- Prompt leakage control: fixed templates, no manual prompt edits mid-run
- Evaluator blinding (if used): automated scoring first, human review second
- Seed robustness strategy: replicate with seeds 1313, 1707, 1104
- Cross-operator replication plan: second operator reruns same commands and compares artifacts

---

## 7) Reporting Plan

Required outputs:
- Trial JSONL
- Summary JSON
- Metrics CSV
- Plot PNG
- Null results section
- Limitations section

Publication statement:

> "This preregistered protocol evaluates sentience-like indicators and does not claim direct proof of subjective experience."
