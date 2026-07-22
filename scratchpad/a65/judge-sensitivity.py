import json, glob, os, collections

# A_65 analysis 1 — JUDGE SENSITIVITY. The pre-A_64 corpus mine (a64-autopsy/rubric-mine.txt)
# showed near-verbatim complaint templates. Question: on the 5 PLANTED-ERA stories (probe + M3,
# C1/C2/C3 provably active in the prompts), do the same templates persist?
PLANTED_ERA = [
    "mystery-1784662295274",  # probe (tide)
    "mystery-1784663896191",  # M3 clock
    "mystery-1784664846932",  # M3 poison
    "mystery-1784665751813",  # M3 identity
    "mystery-1784667048584",  # M3 tide
]
CATS = ["clues", "plot_structure", "pacing", "prose", "ending", "character_clarity", "opening_hook"]

# The dominant pre-A_64 complaint templates (from the 33-run mine), as key-phrase probes.
TEMPLATES = {
    "clues": ["not always effectively planted", "introduced too late", "not sufficiently planted",
              "insufficiently planted", "lack sufficient foreshadowing", "not adequately foreshadowed",
              "feel unearned", "too subtle"],
    "plot_structure": ["convoluted", "muddled", "conflicting accounts", "timeline becomes", "rushed"],
    "pacing": ["uneven", "drag", "rush"],
    "prose": ["overly descriptive", "overly verbose", "awkward phrasing", "detract from the narrative flow"],
    "ending": ["confession", "emotional payoff", "abrupt", "rushed"],
}

for rid in PLANTED_ERA:
    p = f"apps/api/data/reports/{rid}/{rid}.json"
    d = json.load(open(p, encoding="utf-8"))
    rub = next((x["details"] for x in d.get("diagnostics", []) if x.get("key") == "rubric_score"), {})
    marks = {c["category"]: (c.get("mark"), (c.get("reason") or "").strip()) for c in rub.get("categories", [])}
    print(f"=== {rid}  final={rub.get('final')}")
    for cat in CATS:
        mark, reason = marks.get(cat, (None, ""))
        hits = [t for t in TEMPLATES.get(cat, []) if t.lower() in reason.lower()]
        tag = f"TEMPLATE-HIT[{','.join(hits)}]" if hits else "new-wording"
        print(f"  {cat:18s} [{mark}] {tag}")
        print(f"      {reason[:220]}")
    print()
