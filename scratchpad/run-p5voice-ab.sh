#!/usr/bin/env bash
# A_63 §7.3 — voice-idiolect A/B ×4 pairs. Control = SHADOW (gate observes + logs tic metrics,
# never enforces/repairs — the only way to get tic telemetry on the control arm, since `off` skips
# the gate entirely). Treatment = ENFORCE (leakage repair + gate warning). Flag forced per-process
# on BOTH arms (.env.local does not set AGENT9_VOICE_ENFORCE; dotenv never overrides pre-set env).
# Acceptance (A_63 §2.3): dialogue mark +1 with nothing regressed AND tic metrics not worse —
# leakage pairs down-or-equal, overuse speakers not up (Item 14: tics read as artificial).
# PRE-FLIGHT: requires the build:all containing the overuse-count log line (agent9-run.ts) —
# run only AFTER the 7.2 chain completes (no dist changes while a matched batch runs).
set -u
cd /c/CML
OUT=scratchpad/p5voice
mkdir -p "$OUT"
DONE="$OUT/done.txt"; touch "$DONE"
SUMMARY="$OUT/summary.tsv"
[ -s "$SUMMARY" ] || echo -e "theme\tarm\tgate\trunId" > "$SUMMARY"

node scripts/mark-interrupted-reports.mjs || true

THEMES=(clock poison identity tide)
for T in "${THEMES[@]}"; do
  for ARM in shadow enforce; do
    KEY="${T}_${ARM}"
    if grep -qx "$KEY" "$DONE"; then echo "skip $KEY (already shipped)"; continue; fi
    echo "######## P5-VOICE RUN theme=$T arm=$ARM ($(date +%H:%M:%S)) ########"
    LOG="$OUT/voice_${KEY}.log"
    AGENT9_VOICE_ENFORCE="$ARM" CANARY_THEME="$T" node scripts/canary-core.mjs > "$LOG" 2>&1
    EC=$?
    GATE=$(grep -m1 "CANARY_RELEASE_GATE" "$LOG" | awk '{print $2}')
    RUNID=$(grep -m1 "RUN_ID" "$LOG" | awk '{print $2}')
    echo -e "${T}\t${ARM}\t${GATE:-EXIT$EC}\t${RUNID:-none}" >> "$SUMMARY"
    echo "   -> arm=$ARM gate=${GATE:-EXIT$EC} runId=${RUNID:-none} ec=$EC"
    case "${GATE:-}" in
      # shipped AND scored: an Azure DNS flap can kill the RubricScorer after the gate passes
      # (run_outcome infra_failure, no rubric diagnostics) — that arm is useless to the A/B.
      passed|warning) if grep -q '^\[Rubric\]' "$LOG"; then echo "$KEY" >> "$DONE";
                      else echo "   !! shipped but UNSCORED (rubric missing — infra?) — arm stays queued for rerun"; fi ;;
      *) echo "P5-VOICE CHAIN HALTED on $KEY (gate=${GATE:-EXIT$EC}) — root-cause before rerunning."
         exit 1 ;;
    esac
  done
done
echo "######## P5-VOICE A/B COMPLETE ($(date +%H:%M:%S)) ########"
cat "$SUMMARY"
