#!/usr/bin/env bash
# P5.1 — AGENT9_CRITIQUE_REWRITE fresh-run A/B ×4 pairs (A_62 ROAD TO 80 §4).
# Control arm forces the flag OFF on the command line (wins over .env.local: dotenv never
# overrides pre-set process env; the flag is a runtime getter). Treatment arm = env default (true).
# The P5.1 contamination is thereby handled: control is genuinely OFF despite .env.local.
# Acceptance read (after): opening_hook/dialogue/pacing means +1 with nothing regressed.
# Resumable per arm; halts on abort (same-day-fix rule). ~8 runs, ~£2.
set -u
cd /c/CML
OUT=scratchpad/p5cr
mkdir -p "$OUT"
DONE="$OUT/done.txt"; touch "$DONE"
SUMMARY="$OUT/summary.tsv"
[ -s "$SUMMARY" ] || echo -e "theme\tarm\tstatus\trunId" > "$SUMMARY"

node scripts/mark-interrupted-reports.mjs || true

THEMES=(clock poison identity tide)
for T in "${THEMES[@]}"; do
  for ARM in off on; do
    KEY="${T}_${ARM}"
    if grep -qx "$KEY" "$DONE"; then echo "skip $KEY (already shipped)"; continue; fi
    echo "######## P5-CR RUN theme=$T arm=$ARM ($(date +%H:%M:%S)) ########"
    LOG="$OUT/cr_${KEY}.log"
    if [ "$ARM" = off ]; then FLAG=false; else FLAG=true; fi
    AGENT9_CRITIQUE_REWRITE="$FLAG" CANARY_THEME="$T" node scripts/canary-core.mjs > "$LOG" 2>&1
    EC=$?
    # SHIPPED per the pinned P0.2 definition = release_gate_outcome ∈ {passed, warning}.
    # CANARY_STATUS is phase-threshold-driven and may read `failure` on a shipped run (M1v2-2).
    GATE=$(grep -m1 "CANARY_RELEASE_GATE" "$LOG" | awk '{print $2}')
    RUNID=$(grep -m1 "RUN_ID" "$LOG" | awk '{print $2}')
    echo -e "${T}\t${ARM}\t${GATE:-EXIT$EC}\t${RUNID:-none}" >> "$SUMMARY"
    echo "   -> arm=$ARM gate=${GATE:-EXIT$EC} runId=${RUNID:-none} ec=$EC"
    case "${GATE:-}" in
      passed|warning) echo "$KEY" >> "$DONE" ;;
      *) echo "P5-CR CHAIN HALTED on $KEY (gate=${GATE:-EXIT$EC}) — root-cause before rerunning."
         exit 1 ;;
    esac
  done
done
echo "######## P5-CR A/B COMPLETE ($(date +%H:%M:%S)) ########"
cat "$SUMMARY"
