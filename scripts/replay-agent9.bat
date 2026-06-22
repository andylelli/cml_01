@echo off
REM ============================================================================
REM  replay-agent9.bat - re-run ONLY Agent 9 (prose generation) against a prior
REM  run's frozen upstream artifacts, then rubric-score the result.
REM
REM  Usage:
REM    scripts\replay-agent9.bat [projectId] [label]
REM
REM  Args:
REM    projectId  (optional) project whose artifacts to replay.
REM               Default: proj_8e6d7185-cf4a-4741-ae73-8e6e987fe3cc (ANALYSIS_46 run)
REM    label      (optional) run label; becomes the output folder name
REM               stories\replay_<label>\ . Default: replay-<timestamp>.
REM
REM  Env:
REM    REPLAY_SKIP_BUILD=1   skip the worker rebuild (use last compiled dist)
REM    REPLAY_DRY=1          load artifacts + build context but DO NOT call the LLM
REM    REPLAY_PROSE_BATCH=N  chapters per LLM call (default 10)
REM
REM  Azure creds are read from .env.local / .env at the repo root.
REM ============================================================================
setlocal

REM cd to repo root (this script lives in scripts\)
cd /d "%~dp0.."

set "PROJECT=%~1"
if "%PROJECT%"=="" set "PROJECT=proj_8e6d7185-cf4a-4741-ae73-8e6e987fe3cc"
set "LABEL=%~2"

echo [replay-agent9] workspace : %CD%
echo [replay-agent9] project   : %PROJECT%

if "%REPLAY_SKIP_BUILD%"=="1" (
  echo [replay-agent9] build     : SKIPPED ^(REPLAY_SKIP_BUILD=1^)
) else (
  echo [replay-agent9] build     : rebuilding apps/worker ^(picks up Agent 9 fixes^) ...
  call npm run build -w apps/worker
  if errorlevel 1 (
    echo [replay-agent9] BUILD FAILED - aborting.
    exit /b 1
  )
)

if not exist "apps\worker\dist\jobs\agent9-replay.js" (
  echo [replay-agent9] dist\jobs\agent9-replay.js missing - run once without REPLAY_SKIP_BUILD=1.
  exit /b 1
)

echo [replay-agent9] running ...
node --use-system-ca "apps\worker\dist\jobs\agent9-replay.js" "%PROJECT%" "%LABEL%"
set "RC=%errorlevel%"
exit /b %RC%
