#!/usr/bin/env python3
"""Rebuild suite manifest from existing run folders when orchestrator exits early."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict, List


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def collect_runs(root: Path) -> List[Dict]:
    runs: List[Dict] = []
    for seed_dir in sorted([p for p in root.glob("seed-*") if p.is_dir()]):
        seed_str = seed_dir.name.replace("seed-", "")
        try:
            seed = int(seed_str)
        except ValueError:
            seed = -1
        for cond_dir in sorted([p for p in seed_dir.iterdir() if p.is_dir()]):
            summary = cond_dir / "sentience_summary.json"
            metrics = cond_dir / "sentience_metrics.csv"
            trials = cond_dir / "sentience_trials.jsonl"
            progress = cond_dir / "run_progress.log"

            status = "ok" if summary.exists() and metrics.exists() and trials.exists() else "partial"
            run: Dict = {
                "seed": seed,
                "condition": cond_dir.name,
                "status": status,
                "artifacts": {
                    "summary": str(summary),
                    "metrics": str(metrics),
                    "trials": str(trials),
                    "progress": str(progress),
                },
            }
            if summary.exists():
                run["summary_json"] = load_json(summary)
            runs.append(run)
    return runs


def main() -> None:
    parser = argparse.ArgumentParser(description="Rebuild suite manifest")
    parser.add_argument("--root", default="download/sentience-suite-v1-clean")
    parser.add_argument("--model", default="aero.1313hz")
    parser.add_argument("--trials", type=int, default=20)
    parser.add_argument("--steps", type=int, default=100)
    args = parser.parse_args()

    root = Path(args.root)
    runs = collect_runs(root)

    manifest = {
        "config": {
            "model": args.model,
            "trials": args.trials,
            "steps": args.steps,
        },
        "runs": runs,
        "status": "ok" if runs and all(r.get("status") == "ok" for r in runs) else "partial-failure",
    }

    out = root / "suite_manifest.json"
    out.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps({"manifest": str(out), "run_count": len(runs), "status": manifest["status"]}, indent=2))


if __name__ == "__main__":
    main()
