#!/usr/bin/env bash
# THE canonical singular-probe harness (§2.8 regime). Embodies the A_65b Ph1–Ph3 rules:
# preflight before any run (stale-dist class), one run only, measures derived immediately
# (the era's longitudinal TSV). No sleep_guard needed (~15 min active).
#   usage: bash scratchpad/run-probe.sh <theme> <label>
#   e.g.:  bash scratchpad/run-probe.sh tide a65-phase1
set -u
cd /c/CML
source scripts/harness-lib.sh

THEME="${1:?usage: run-probe.sh <theme> <label>}"
LABEL="${2:?usage: run-probe.sh <theme> <label>}"
OUT="scratchpad/probes"
mkdir -p "$OUT"
LOG="$OUT/${LABEL}_${THEME}.log"

preflight
node scripts/mark-interrupted-reports.mjs || true

echo "######## PROBE ${LABEL} theme=${THEME} ($(date +%H:%M:%S)) ########"
CANARY_THEME="$THEME" node scripts/canary-core.mjs > "$LOG" 2>&1
EC=$?
GATE=$(grep -m1 "CANARY_RELEASE_GATE" "$LOG" | awk '{print $2}')
RUNID=$(grep -m1 "RUN_ID" "$LOG" | awk '{print $2}')
SCORED=$(grep -c "\[Rubric\]" "$LOG")
echo "-> gate=${GATE:-EXIT$EC} runId=${RUNID:-none} scored=${SCORED} ec=$EC"

if [ -n "${RUNID:-}" ] && [ "${RUNID}" != "none" ]; then
  # the measures row — craft + reliability read the same probe (A_65 P5 / A_65b Ph3)
  node scratchpad/a65/derive-a65-measures.mjs "$RUNID" "$LOG" || echo "(measures derive failed — run manually)"
fi

case "${GATE:-}" in
  passed|warning)
    if [ "${SCORED:-0}" -lt 1 ]; then echo "PROBE shipped but NOT scored — diagnose the scorer before reading anything."; exit 1; fi
    echo "PROBE COMPLETE." ;;
  *) echo "PROBE DID NOT SHIP (gate=${GATE:-EXIT$EC}) — same-day-fix doctrine applies."; exit 1 ;;
esac
