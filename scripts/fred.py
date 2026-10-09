"""Download a FRED series (no API key needed) into data/<SERIES>.csv and print key stats.
Usage: python3 scripts/fred.py DGS10 [MORTGAGE30US ...]
Every on-screen number in a reel must come from a saved file like this, never typed from memory.
"""
import csv, io, sys, urllib.request

def fetch(series: str) -> None:
    url = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series}"
    try:
        raw = urllib.request.urlopen(url, timeout=60).read().decode()
    except Exception as e:  # network / unknown series
        sys.exit(f"Could not fetch {series}: {e}")
    with open(f"data/{series}.csv", "w") as f:
        f.write(raw)
    rows = [(d, float(v)) for d, v in csv.reader(io.StringIO(raw)) if d != "observation_date" and v not in ("", ".")]
    if not rows:
        sys.exit(f"{series}: no numeric rows")
    hi = max(rows, key=lambda r: r[1])
    lo = min(rows, key=lambda r: r[1])
    print(f"{series}: {len(rows)} rows, {rows[0][0]} → {rows[-1][0]}")
    print(f"  latest {rows[-1][1]} ({rows[-1][0]})  max {hi[1]} ({hi[0]})  min {lo[1]} ({lo[0]})")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for s in sys.argv[1:]:
        fetch(s)
