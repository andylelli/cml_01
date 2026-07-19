#!/usr/bin/env bash
# M2 ceiling-check batch (A_62 ROAD TO 80 §3) — ≥4 matched fresh runs on the post-P3/P4 config:
# scaffold regen ON (code default 6d44f800), Item-17 leakage source-fix + mobile/digital polysemy
# guards in dist (build:all 2026-07-19), leakage/dual-value regen OFF (per P3 verdicts).
# Verdict inputs: top-4 caps ≤1 occurrence across the batch, median shipped rubric ≥ 73.
# Resumable: shipped themes are recorded in done.txt and skipped on rerun (RC-5 lesson).
# Halts on an abort so the class gets same-day-fix treatment before more spend (road-to-80 §3).
set -u
cd /c/CML
OUT=scratchpad/m2
mkdir -p "$OUT"
DONE="$OUT/done.txt"; touch "$DONE"
SUMMARY="$OUT/summary.tsv"
[ -s "$SUMMARY" ] || echo -e "theme\tstatus\trunId" > "$SUMMARY"

# stamp any dead in_progress reports before deriving anything from the reports dir
node scripts/mark-interrupted-reports.mjs || true

THEMES=(clock poison identity tide)
for T in "${THEMES[@]}"; do
  if grep -qx "$T" "$DONE"; then echo "skip $T (already shipped)"; continue; fi
  echo "######## M2 RUN theme=$T ($(date +%H:%M:%S)) ########"
  LOG="$OUT/m2_${T}.log"
  CANARY_THEME="$T" node scripts/canary-core.mjs > "$LOG" 2>&1
  EC=$?
  # SHIPPED per the pinned P0.2 definition = release_gate_outcome ∈ {passed, warning}.
  # CANARY_STATUS is phase-threshold-driven and may read `failure` on a shipped run (M1v2-2).
  GATE=$(grep -m1 "CANARY_RELEASE_GATE" "$LOG" | awk '{print $2}')
  RUNID=$(grep -m1 "RUN_ID" "$LOG" | awk '{print $2}')
  echo -e "${T}\t${GATE:-EXIT$EC}\t${RUNID:-none}" >> "$SUMMARY"
  echo "   -> gate=${GATE:-EXIT$EC} runId=${RUNID:-none} ec=$EC"
  case "${GATE:-}" in
    passed|warning) echo "$T" >> "$DONE" ;;
    *) echo "M2 CHAIN HALTED on theme=$T (gate=${GATE:-EXIT$EC}) — root-cause before rerunning; chain resumes past shipped themes."
       exit 1 ;;
  esac
done
echo "######## M2 BATCH COMPLETE ($(date +%H:%M:%S)) ########"
cat "$SUMMARY"
