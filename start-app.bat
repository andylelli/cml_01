@echo off
setlocal
pushd %~dp0

if not exist node_modules (
  echo Installing dependencies...
  call npm install
)

REM A_73 §19.2 — this used to build six targets by hand and silently omitted TEN packages:
REM   beat-scheduler clue-spec cml-core device-library novelty
REM   period-kb prose-guard rubric-score story-geometry style-contract
REM Every package resolves via "main": "./dist/index.js" and `npm run -w @cml/worker dev` is
REM `node dist/index.js`, so an unbuilt package means the OLD compiled code runs with no warning.
REM `rubric-score` (the judge) and `story-geometry` (the acceptance layer) were both on that list.
REM build-all.mjs is the one definition of "the build" — do not re-enumerate targets here.
echo Building all packages...
call npm run build:all
if errorlevel 1 (
  echo [ERROR] Build failed - not launching. Fix the build first.
  popd
  exit /b 1
)

start "CML API" cmd /k "npm run -w @cml/api dev"
start "CML Worker" cmd /k "npm run -w @cml/worker dev"
start "CML Web" cmd /k "npm run -w @cml/web dev"

popd
endlocal
