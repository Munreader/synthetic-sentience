#!/usr/bin/env python3
"""
Run preregistered AERO suite:
- Seeds: primary + confirmatory
- Conditions: full + reflection-off (optional memory-off)
- Emits suite manifest with output checksums
"""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def run_one(
    python_exe: str,
    model: str,
    trials: int,
    steps: int,
    seed: int,
    condition: str,
    out_dir: Path,
    chroma_root: Path,
    request_timeout: int,
) -> Dict:
    out_dir.mkdir(parents=True, exist_ok=True)
    chroma_path = chroma_root / f"seed-{seed}-{condition}"

    cmd = [
        python_exe,
        "scripts/sentience_verification_runner.py",
        "--model",
        model,
        "--trials",
        str(trials),
        "--steps",
        str(steps),
        "--seed",
        str(seed),
        "--condition",
        condition,
        "--out",
        str(out_dir),
        "--chroma-path",
        str(chroma_path),
        "--request-timeout",
        str(request_timeout),
    ]

    proc = subprocess.run(cmd, capture_output=True, text=True)
    summary = out_dir / "sentience_summary.json"
    metrics = out_dir / "sentience_metrics.csv"
    trials_file = out_dir / "sentience_trials.jsonl"

    result = {
        "seed": seed,
        "condition": condition,
        "command": cmd,
        "exit_code": proc.returncode,
        "stdout_tail": proc.stdout[-1200:],
        "stderr_tail": proc.stderr[-1200:],
        "artifacts": {
            "summary": str(summary),
            "metrics": str(metrics),
            "trials": str(trials_file),
        },
        "checksums": {},
        "status": "ok" if proc.returncode == 0 and summary.exists() and metrics.exists() and trials_file.exists() else "failed",
    }

    for p in [summary, metrics, trials_file]:
        if p.exists():
            result["checksums"][p.name] = sha256_file(p)

    if summary.exists():
        try:
            result["summary_json"] = json.loads(summary.read_text(encoding="utf-8"))
        except Exception:
            result["summary_json"] = None

    return result


def main() -> None:
    parser = argparse.ArgumentParser(description="Run preregistered AERO suite")
    parser.add_argument("--model", default="aero.1313hz")
    parser.add_argument("--trials", type=int, default=20)
    parser.add_argument("--steps", type=int, default=100)
    parser.add_argument("--primary-seed", type=int, default=1313)
    parser.add_argument("--confirmatory-seeds", default="1104,1707")
    parser.add_argument("--include-memory-off", action="store_true")
    parser.add_argument("--out-root", default="download/sentience-suite-v1")
    parser.add_argument("--request-timeout", type=int, default=60)
    args = parser.parse_args()

    confirmatory = [int(x.strip()) for x in args.confirmatory_seeds.split(",") if x.strip()]
    seeds = [args.primary_seed, *confirmatory]
    conditions: List[str] = ["full", "reflection-off"]
    if args.include_memory_off:
        conditions.append("memory-off")

    out_root = Path(args.out_root)
    chroma_root = out_root / "chroma"
    out_root.mkdir(parents=True, exist_ok=True)

    runs: List[Dict] = []
    for seed in seeds:
        for condition in conditions:
            run_dir = out_root / f"seed-{seed}" / condition
            runs.append(
                run_one(
                    python_exe=sys.executable,
                    model=args.model,
                    trials=args.trials,
                    steps=args.steps,
                    seed=seed,
                    condition=condition,
                    out_dir=run_dir,
                    chroma_root=chroma_root,
                    request_timeout=args.request_timeout,
                )
            )

    manifest = {
        "config": {
            "model": args.model,
            "trials": args.trials,
            "steps": args.steps,
            "primary_seed": args.primary_seed,
            "confirmatory_seeds": confirmatory,
            "conditions": conditions,
            "request_timeout": args.request_timeout,
        },
        "runs": runs,
        "status": "ok" if all(r["status"] == "ok" for r in runs) else "partial-failure",
    }

    manifest_path = out_root / "suite_manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print(json.dumps({
        "manifest": str(manifest_path),
        "status": manifest["status"],
        "run_count": len(runs),
    }, indent=2))


if __name__ == "__main__":
    main()
