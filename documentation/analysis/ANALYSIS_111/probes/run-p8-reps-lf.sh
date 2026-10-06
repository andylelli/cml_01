#!/usr/bin/env bash
# A_111 P-8 — the harness with the locked facts a real Agent 3 prompt carries: 4 cases x {off,on} x 3, 4 at a time.
OUT=documentation/analysis/ANALYSIS_111/harness-p8/reps-lf
one() {
  project=$1; seed=$2; arm=$3; rep=$4; source=$5
  yaml=scripts/generated/run-params-$seed.yaml
  theme=$(grep -m1 '^theme:' "$yaml" | sed -E 's/^theme:[[:space:]]*"?//; s/"[[:space:]]*$//')
  axis=$(grep -m1 '^primaryAxis:' "$yaml" | sed -E 's/^primaryAxis:[[:space:]]*//')
  if [ "$arm" = on ]; then export AGENT3_ONE_MECHANISM=1 AGENT3_ALIBI_COVERS=1; else unset AGENT3_ONE_MECHANISM AGENT3_ALIBI_COVERS; fi
  extra=""; [ "$source" != "-" ] && extra="--sourceRun $source"
  node --use-system-ca apps/worker/dist/harness/agent3-direct-llm-check-harness.js --project "$project" --theme "$theme" --axis "$axis" $extra \
    --runId "a111-p8lf-$seed-$arm-$rep" --out "$OUT/$project-$arm$rep.json" > /dev/null 2>&1
  echo "$project $arm $rep exit $?"
}
export -f one; export OUT
for spec in canary_1789241614485:94118:- canary_1789583740167:95041:- canary_1790272530595:23403:- canary_1790962241799:82094:mystery-1790962241800; do
  IFS=: read project seed source <<< "$spec"
  for arm in off on; do for rep in 1 2 3; do echo "$project $seed $arm $rep $source"; done; done
done | xargs -P 4 -L 1 bash -c 'one "$@"' _
echo "P8-LF-DONE"
