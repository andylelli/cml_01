#!/usr/bin/env bash
# A_65b Ph1.2 (reliability plan) — shared harness helpers.
#
# sleep_guard: any harness expected to run >30 min unattended calls `sleep_guard` once at the
# top. It disables AC standby for the harness's lifetime and RESTORES 2700s (45 min, the 7.9
# close-out value) on ANY exit — clean, error, or Ctrl-C. Retires the host-sleep loss class
# (2 batch runs lost: overnight standby + flat battery) without re-opening the daily-use debt.
# Singular probes (~15 min active CPU) don't need it.
#
# preflight: every harness calls `preflight` before its first run — the stale-dist class
# (the A_64 probe's C3 slip) died here.
#
# Usage:
#   source "$(dirname "$0")/../scripts/harness-lib.sh"   # or scripts/harness-lib.sh from root
#   preflight
#   sleep_guard          # only for >30-min unattended chains

sleep_guard() {
  powercfg /change standby-timeout-ac 0
  # minutes form; 45 min = the 2700s close-out value
  trap 'powercfg /change standby-timeout-ac 45' EXIT
  echo "[harness] sleep guard ON (AC standby disabled; restores 45 min on exit)"
}

preflight() {
  node "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/preflight-dist-check.mjs" || {
    echo "[harness] PREFLIGHT FAILED — rebuild stale dists before running." >&2
    exit 1
  }
}
