import json, glob, re, sys

POOL = [
    # 7.2 final-config arms (Jul 20)
    ("dv_clock_off", "mystery-1784568348619"), ("dv_clock_on", "mystery-1784569235134"),
    ("dv_poison_off", "mystery-1784571763605"), ("dv_poison_on", "mystery-1784572735935"),
    ("dv_identity_off", "mystery-1784574136763"), ("dv_identity_on", "mystery-1784574963400"),
    ("dv_tide_off", "mystery-1784576119605"), ("dv_tide_on", "mystery-1784578387267"),
    # 7.3 arms
    ("v_clock_shadow", "mystery-1784579381610"), ("v_clock_enforce", "mystery-1784580158372"),
    ("v_poison_shadow", "mystery-1784580961906"), ("v_poison_enforce", "mystery-1784582686670"),
    ("v_identity_shadow", "mystery-1784583752603"), ("v_identity_enforce", "mystery-1784584788539"),
    ("v_tide_shadow", "mystery-1784585699975"), ("v_tide_enforce", "mystery-1784586490642"),
]

def walk_strings(o):
    if isinstance(o, str):
        yield o
    elif isinstance(o, dict):
        for v in o.values(): yield from walk_strings(v)
    elif isinstance(o, list):
        for v in o: yield from walk_strings(v)

for arm, rid in POOL:
    path = f"apps/api/data/reports/{rid}/{rid}.json"
    try:
        d = json.load(open(path, encoding="utf-8"))
    except Exception as e:
        print(f"{arm}\t{rid}\tLOAD_FAIL {e}")
        continue

    caps, cats = [], {}
    for diag in d.get("diagnostics", []):
        det = diag.get("details", {})
        if isinstance(det, dict) and "caps_applied" in det:
            caps = det["caps_applied"]
            for c in det.get("categories", []):
                if isinstance(c, dict):
                    k = c.get("key") or c.get("category") or c.get("name")
                    cats[k] = (c.get("score"), c.get("capped", False))

    # warnings anywhere in the artifact
    warn_lines = set()
    for s in walk_strings(d.get("warnings", d)):
        if "scaffold" in s.lower() and len(s) < 400:
            warn_lines.add(s.strip())

    scaffold_cap = [c for c in caps if "scaffold" in c.lower()]
    regen_dram = [w for w in warn_lines if "regen-scaffold dramatized" in w]
    regen_unres = [w for w in warn_lines if "regen-scaffold UNRESOLVED" in w]
    other_scaf = [w for w in warn_lines if "regen-scaffold" not in w]

    print(f"=== {arm} {rid}")
    print(f"  RUBRIC scaffold cap: {'YES' if scaffold_cap else 'no'}  {scaffold_cap[:1]}")
    print(f"  all caps: {caps}")
    print(f"  detector: dramatized={len(regen_dram)} unresolved={len(regen_unres)} other-scaffold-warn={len(other_scaf)}")
    for w in sorted(regen_dram)[:4]: print(f"    DRAM {w[:150]}")
    for w in sorted(regen_unres)[:4]: print(f"    UNRES {w[:150]}")
    for w in sorted(other_scaf)[:4]: print(f"    OTHER {w[:150]}")
