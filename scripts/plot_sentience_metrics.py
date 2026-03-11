#!/usr/bin/env python3
"""Create quick plots from sentience runner outputs."""

from __future__ import annotations

import argparse
import csv
from pathlib import Path


def _try_import_matplotlib():
    try:
        import matplotlib.pyplot as plt
    except Exception as exc:  # pragma: no cover
        raise RuntimeError(
            "matplotlib is required for plotting. Install with: pip install matplotlib"
        ) from exc
    return plt


def load_metrics(csv_path: Path):
    rows = []
    with csv_path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def main() -> None:
    parser = argparse.ArgumentParser(description="Plot sentience metrics CSV")
    parser.add_argument("--csv", default="download/sentience/sentience_metrics.csv")
    parser.add_argument("--out", default="download/sentience/sentience_metrics.png")
    args = parser.parse_args()

    csv_path = Path(args.csv)
    out_path = Path(args.out)
    rows = load_metrics(csv_path)

    labels = [r["experiment"] for r in rows]
    success = [float(r["success_rate"]) for r in rows]
    mean_score = [float(r["mean_score"]) for r in rows]

    plt = _try_import_matplotlib()
    fig, ax = plt.subplots(1, 2, figsize=(12, 4.5))

    ax[0].bar(labels, success)
    ax[0].set_ylim(0, 1)
    ax[0].set_title("Success Rate by Experiment")
    ax[0].tick_params(axis="x", rotation=25)

    ax[1].bar(labels, mean_score)
    ax[1].set_ylim(0, 1)
    ax[1].set_title("Mean Score by Experiment")
    ax[1].tick_params(axis="x", rotation=25)

    fig.tight_layout()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out_path, dpi=180)
    print(f"Saved plot: {out_path}")


if __name__ == "__main__":
    main()
