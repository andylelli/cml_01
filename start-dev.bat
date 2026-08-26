@echo off
setlocal
pushd %~dp0

set "REPO_ROOT=%~dp0"
set "DRY_RUN=0"
if /I "%~1"=="--dry-run" set "DRY_RUN=1"

if not exist "%REPO_ROOT%dev-shell.ps1" (
  echo [ERROR] Missing dev-shell.ps1 in repo root.
  popd
  exit /b 1
)

if "%DRY_RUN%"=="1" (
  echo [DRY RUN] Would launch:
  echo   CML API    - npm run -w @cml/api dev
  echo   CML Worker - npm run -w @cml/worker dev
  echo   CML Web    - npm run -w @cml/web dev
  popd
  exit /b 0
)

echo Launching CML API, Worker, and Web dev servers...

start "CML API" powershell -NoExit -ExecutionPolicy Bypass -Command "Set-Location '%REPO_ROOT%'; & '.\dev-shell.ps1'; npm run -w @cml/api dev"
start "CML Worker" powershell -NoExit -ExecutionPolicy Bypass -Command "Set-Location '%REPO_ROOT%'; & '.\dev-shell.ps1'; npm run -w @cml/worker dev"
start "CML Web" powershell -NoExit -ExecutionPolicy Bypass -Command "Set-Location '%REPO_ROOT%'; & '.\dev-shell.ps1'; npm run -w @cml/web dev"

echo Done. Use stop-all.bat to stop all three windows.

popd
endlocal
