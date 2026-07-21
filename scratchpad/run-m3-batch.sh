#!/usr/bin/env bash
# M3 — THE CAMPAIGN'S FINAL BATCH (A_63 §2.6 / A_64 board; run budget cut 33% → EXACTLY 4 runs).
# Final defaults: full A_64 build (F1–F5 + C1–C3) + AGENT7_PLANT_BEFORE_REVEAL + AGENT7_DISCOVERY_TELL
# (probe-verified 2026-07-21, mystery-1784662295274, zero caps). Acceptance (A_63 §6, ALL FOUR on this
# batch): external mean ≥ 80 (owner's manual reads) · |internal−external| ≤ 3 · ship rate 100% with
# zero reliability rows and zero top-4 caps · category floor mean ≥ 8.0.
# Resumable (done.txt skips shipped themes); HALTS on an abort for same-day-fix (house doctrine).
set -u
cd /c/CML
OUT=scratchpad/m3
mkdir -p "$OUT"
DONE="$OUT/done.txt"; touch "$DONE"
SUMMARY="$OUT/summary.tsv"
[ -s "$SUMMARY" ] || echo -e "theme\tgate\trunId" > "$SUMMARY"

node scripts/mark-interrupted-reports.mjs || true

THEMES=(clock poison identity tide)
for T in "${THEMES[@]}"; do
  if grep -qx "$T" "$DONE"; then echo "skip $T (already shipped)"; continue; fi
  echo "######## M3 RUN theme=$T ($(date +%H:%M:%S)) ########"
  LOG="$OUT/m3_${T}.log"
  CANARY_THEME="$T" node scripts/canary-core.mjs > "$LOG" 2>&1
  EC=$?
  GATE=$(grep -m1 "CANARY_RELEASE_GATE" "$LOG" | awk '{print $2}')
  RUNID=$(grep -m1 "RUN_ID" "$LOG" | awk '{print $2}')
  # shipped-AND-scored: the gate alone is not enough (DNS-killed scorer lesson) — require a [Rubric] line.
  SCORED=$(grep -c "\[Rubric\]" "$LOG")
  echo -e "${T}\t${GATE:-EXIT$EC}\t${RUNID:-none}" >> "$SUMMARY"
  echo "   -> gate=${GATE:-EXIT$EC} runId=${RUNID:-none} scored=${SCORED} ec=$EC"
  case "${GATE:-}" in
    passed|warning)
      if [ "${SCORED:-0}" -ge 1 ]; then echo "$T" >> "$DONE";
      else echo "M3 HALTED on theme=$T: shipped but NOT scored (scorer died post-gate) — rerun after diagnosis."; exit 1; fi ;;
    *) echo "M3 CHAIN HALTED on theme=$T (gate=${GATE:-EXIT$EC}) — same-day-fix before more spend."
       exit 1 ;;
  esac
done
echo "######## M3 BATCH COMPLETE ($(date +%H:%M:%S)) ########"
cat "$SUMMARY"
