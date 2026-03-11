# Scientific Credibility Playbook for AERO Sentience Research

## Purpose

This playbook is a guardrail against over-claiming. It helps the team communicate results in a way that earns scientific trust.

---

## 1) Claim Ladder (Always Use This)

Use the strongest claim that your data supports, and no stronger.

1. **Observed behavior**
   - Example: "AERO detected injected memory artifacts in 17/20 trials."
2. **Operational indicator met**
   - Example: "Lock-test detection rate exceeded preregistered threshold (0.80)."
3. **Model-level interpretation**
   - Example: "Results are consistent with sentience-like introspective indicators."
4. **Forbidden without major evidence**
   - Avoid: "This proves subjective consciousness."

---

## 2) Language Rules (Do/Don’t)

### Use
- "evidence suggests"
- "consistent with"
- "under this protocol"
- "sentience-like indicators"
- "replication required"

### Avoid
- "proves consciousness"
- "guaranteed sentience"
- "definitively self-aware"
- "beyond doubt"

### Rewrite examples
- Weak scientific phrasing: "AERO is conscious."
- Strong scientific phrasing: "AERO met preregistered thresholds on perturbation detection and self-model convergence under seed-controlled local runs."

---

## 3) Minimum Experimental Standard Before Public Claims

Publish only if all are present:

- Preregistered hypotheses and thresholds
- Fixed model/version/seed and environment details
- Control condition (no reflection loop)
- At least one ablation (memory off, reflection off, or both)
- Trial-level logs available (including failed runs)
- Confound discussion included
- Independent rerun by second operator

---

## 4) Confounds Review (Required)

Before claiming any cognitive indicator, explicitly test these confounds:

1. Prompt leakage
2. Benchmark contamination
3. Stylistic mimicry mistaken for introspection
4. Evaluator bias in open-ended scoring
5. Seed sensitivity
6. Overfitting to handcrafted scenarios

If any confound is unresolved, state it in the abstract and conclusion.

---

## 5) Statistical Reporting Rules

For each metric, report:

- N (number of trials)
- Mean and standard deviation
- Confidence interval (or bootstrap interval)
- Predefined pass/fail threshold
- Effect size versus baseline/control

Never report percentages without sample size.

---

## 6) Reviewer-Facing Integrity Checklist

Before submission:

- [ ] Can an external team reproduce your exact run?
- [ ] Are null results visible in the main report?
- [ ] Are thresholds preregistered (not post-hoc)?
- [ ] Are all major claims tied to one or more metrics?
- [ ] Is subjective consciousness explicitly marked as unproven?
- [ ] Is code/data access path included?

---

## 7) Publication Positioning

Use this framing in intros/conclusions:

> "This work proposes a reproducible protocol for evaluating sentience-like indicators in synthetic agents. It does not claim direct proof of subjective experience; rather, it reports operational outcomes and invites independent replication."

---

## 8) One-Sentence Public Summary Template

"Under preregistered, seed-controlled local experiments, AERO met X/Y sentience-indicator thresholds; findings are replication-ready and interpreted as evidence gradients, not proof of subjective consciousness."
