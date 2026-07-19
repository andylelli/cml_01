#!/usr/bin/env bash
# A_63 §7.2 — AGENT9_REGEN_DUAL_VALUE fresh-run A/B ×4 pairs (the only over-bar cap after M2).
# Replay could never measure this lever (hydrated world-state yields a null pair — A_62 P3);
# fresh runs are the evidence-gated route. Flag forced per-process on BOTH arms (dotenv never
# overrides pre-set env; .env.local does not set this flag — code default is false).
# Verdict: dualValueNoContrast cap movement on its own detector, no completeness_structure or
# pronoun regressions (the P4-gate rule). Ship signal = CANARY_RELEASE_GATE only (P0.2).
set -u
cd /c/CML
OUT=scratchpad/p5dv
mkdir -p "$OUT"
DONE="$OUT/done.txt"; touch "$DONE"
SUMMARY="$OUT/summary.tsv"
[ -s "$SUMMARY" ] || echo -e "theme\tarm\tgate\trunId" > "$SUMMARY"

node scripts/mark-interrupted-reports.mjs || true

THEMES=(clock poison identity tide)
for T in "${THEMES[@]}"; do
  for ARM in off on; do
    KEY="${T}_${ARM}"
    if grep -qx "$KEY" "$DONE"; then echo "skip $KEY (already shipped)"; continue; fi
    echo "######## P5-DV RUN theme=$T arm=$ARM ($(date +%H:%M:%S)) ########"
    LOG="$OUT/dv_${KEY}.log"
    if [ "$ARM" = off ]; then FLAG=false; else FLAG=true; fi
    AGENT9_REGEN_DUAL_VALUE="$FLAG" CANARY_THEME="$T" node scripts/canary-core.mjs > "$LOG" 2>&1
    EC=$?
    GATE=$(grep -m1 "CANARY_RELEASE_GATE" "$LOG" | awk '{print $2}')
    RUNID=$(grep -m1 "RUN_ID" "$LOG" | awk '{print $2}')
    echo -e "${T}\t${ARM}\t${GATE:-EXIT$EC}\t${RUNID:-none}" >> "$SUMMARY"
    echo "   -> arm=$ARM gate=${GATE:-EXIT$EC} runId=${RUNID:-none} ec=$EC"
    case "${GATE:-}" in
      passed|warning) echo "$KEY" >> "$DONE" ;;
      *) echo "P5-DV CHAIN HALTED on $KEY (gate=${GATE:-EXIT$EC}) — root-cause before rerunning."
         exit 1 ;;
    esac
  done
done
echo "######## P5-DV A/B COMPLETE ($(date +%H:%M:%S)) ########"
cat "$SUMMARY"
