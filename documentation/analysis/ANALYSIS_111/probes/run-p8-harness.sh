#!/usr/bin/env bash
# A_111 P-8 — one real Agent 3 call per (case, arm) through the harness (apps/worker/dist), written to harness-p8/.
# Arms: off (both A_111 Agent 3 flags unset) and on (AGENT3_ONE_MECHANISM=1 AGENT3_ALIBI_COVERS=1). Needs build:all.
set -u
OUT=documentation/analysis/ANALYSIS_111/harness-p8
CASES="canary_1789241614485:94118 canary_1789583740167:95041 canary_1790272530595:23403 canary_1790962241799:82094"
for pair in $CASES; do
  project=${pair%%:*}; seed=${pair##*:}
  yaml=scripts/generated/run-params-$seed.yaml
  theme=$(grep -m1 '^theme:' "$yaml" | sed -E 's/^theme:[[:space:]]*"?//; s/"[[:space:]]*$//')
  axis=$(grep -m1 '^primaryAxis:' "$yaml" | sed -E 's/^primaryAxis:[[:space:]]*//')
  for arm in off on; do
    if [ "$arm" = on ]; then export AGENT3_ONE_MECHANISM=1 AGENT3_ALIBI_COVERS=1; else unset AGENT3_ONE_MECHANISM AGENT3_ALIBI_COVERS; fi
    echo "== $project ($axis, seed $seed) arm $arm"
    node --use-system-ca apps/worker/dist/harness/agent3-direct-llm-check-harness.js --project "$project" --theme "$theme" --axis "$axis" \
      --runId "a111-p8-$seed-$arm" --out "$OUT/$project-$arm.json" 2>&1 | grep -E "Error|error|cost|wrote|written" | grep -v "^WARNINGS " | tail -2
  done
done
echo "P8-HARNESS-DONE"
