#!/usr/bin/env bash
# M1 (roadmap S5) clean ship-rate batch — 4 diverse themes, sequential, one lever set (FLOOR flags in
# .env.local, unchanged between runs). Captures status + runId per run; the report JSON is parsed after.
set -u
cd /c/CML
OUT=scratchpad/m1
mkdir -p "$OUT"
THEMES=(clock poison identity tide)
SUMMARY="$OUT/summary.tsv"
: > "$SUMMARY"
echo -e "theme\tstatus\trunId\tprojectId" >> "$SUMMARY"

for T in "${THEMES[@]}"; do
  echo "######## M1 RUN theme=$T ($(date +%H:%M:%S)) ########"
  LOG="$OUT/m1_${T}.log"
  CANARY_THEME="$T" node scripts/canary-core.mjs > "$LOG" 2>&1
  EC=$?
  STATUS=$(grep -m1 "CANARY_STATUS" "$LOG" | awk '{print $2}')
  RUNID=$(grep -m1 "RUN_ID" "$LOG" | awk '{print $2}')
  # projectId appears in the inputs echo or the report path; grab from CANARY_INPUTS if present
  PROJ=$(grep -m1 -oE '"projectId":"[^"]+"' "$LOG" | head -1 | sed 's/.*://; s/"//g')
  echo -e "${T}\t${STATUS:-EXIT$EC}\t${RUNID:-none}\t${PROJ:-none}" >> "$SUMMARY"
  echo "   -> status=${STATUS:-EXIT$EC} runId=${RUNID:-none}"
done

echo "######## M1 BATCH COMPLETE ($(date +%H:%M:%S)) ########"
cat "$SUMMARY"
