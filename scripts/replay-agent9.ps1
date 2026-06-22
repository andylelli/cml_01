<#
.SYNOPSIS
  Thin PowerShell wrapper around scripts\replay-agent9.bat.

.DESCRIPTION
  Re-runs ONLY Agent 9 (prose generation) against a prior run's frozen upstream
  artifacts (from data/store.json), then rubric-scores the result. All real work is
  done by replay-agent9.bat / apps/worker/dist/jobs/agent9-replay.js; this wrapper
  exists so the bench can be launched from a PowerShell prompt.

.PARAMETER Project
  Project whose artifacts to replay. Defaults to the ANALYSIS_46 run inside the .bat.

.PARAMETER Label
  Optional run label (runId / log + prompt-doc names). The story is written to the
  normal stories\story_<YYYYMMDD-HHMM>\ folder, same as a real run.

.PARAMETER SkipBuild
  Skip the worker rebuild and use the last compiled dist.

.PARAMETER Dry
  Load artifacts + build the context but do NOT call the LLM (cheap sanity check).

.EXAMPLE
  pwsh scripts\replay-agent9.ps1
.EXAMPLE
  pwsh scripts\replay-agent9.ps1 -Project proj_8e6d7185-... -Label fix-leakage-v1
.EXAMPLE
  pwsh scripts\replay-agent9.ps1 -SkipBuild -Dry
#>
param(
  [string]$Project = "",
  [string]$Label = "",
  [switch]$SkipBuild,
  [switch]$Dry
)

$ErrorActionPreference = "Stop"
$bat = Join-Path $PSScriptRoot "replay-agent9.bat"
if (-not (Test-Path $bat)) { throw "replay-agent9.bat not found next to this script ($bat)" }

if ($SkipBuild) { $env:REPLAY_SKIP_BUILD = "1" }
if ($Dry)       { $env:REPLAY_DRY = "1" }

& $bat $Project $Label
exit $LASTEXITCODE
