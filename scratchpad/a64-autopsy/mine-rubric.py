import json, glob, os, statistics, collections

# Mine every on-disk report's rubric details: per-category marks + reasons,
# main_problems, fastest_fixes. Group free text by category for the craft design.
CATS = ["premise", "opening_hook", "plot_structure", "character_clarity", "dialogue",
        "atmosphere", "clues", "pacing", "ending", "prose"]

reports = sorted(glob.glob("apps/api/data/reports/mystery-*/mystery-*.json"))
marks = collections.defaultdict(list)
reasons = collections.defaultdict(list)
problems, fixes = [], []
n = 0
for p in reports:
    try:
        d = json.load(open(p, encoding="utf-8"))
    except Exception:
        continue
    rub = next((x.get("details") for x in d.get("diagnostics", []) if x.get("key") == "rubric_score"), None)
    if not rub:
        continue
    n += 1
    rid = os.path.basename(p).replace(".json", "")
    for c in rub.get("categories", []):
        k, m = c.get("category"), c.get("mark")
        if k in CATS and isinstance(m, (int, float)):
            marks[k].append(m)
            r = (c.get("reason") or "").strip()
            if r and m <= 6:  # only keep the deficit explanations
                reasons[k].append((m, rid, r))
    for x in rub.get("main_problems", []) or []:
        problems.append(str(x))
    for x in rub.get("fastest_fixes", []) or []:
        fixes.append(str(x))

print(f"reports with rubric: {n}\n")
print(f"{'category':18s} {'n':>3s} {'mean':>5s} {'med':>4s} {'<=6 (deficit share)':>20s}")
for k in CATS:
    v = marks[k]
    if not v: continue
    lo = len([x for x in v if x <= 6])
    print(f"{k:18s} {len(v):3d} {statistics.mean(v):5.2f} {statistics.median(v):4.1f} {lo:4d}/{len(v)} ({100*lo//len(v)}%)")

print("\n=== DEFICIT REASONS (mark<=6), grouped ===")
for k in ["clues", "plot_structure", "opening_hook", "prose", "pacing", "character_clarity", "ending"]:
    print(f"\n--- {k} ({len(reasons[k])} deficit reasons) ---")
    for m, rid, r in reasons[k]:
        print(f"  [{m}] {r[:220]}")

print("\n=== MAIN PROBLEMS (all runs) ===")
for x in problems: print(" -", x[:220])
print("\n=== FASTEST FIXES (all runs) ===")
for x in fixes: print(" -", x[:220])
