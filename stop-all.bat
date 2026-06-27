@echo off
echo Stopping CML services...

REM 1) Kill windows started by start-app.bat (fast path).
taskkill /FI "WINDOWTITLE eq CML API*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq CML Worker*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq CML Web*" /T /F >nul 2>&1

REM 2) Robust: kill ANYTHING still listening on the CML ports, however it was started
REM    (a plain "npm run dev", stray vite ports 3001/3002/..., duplicate instances).
REM    The web (vite) climbs 3000 -> 3001 -> ... when earlier servers are left running.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$pids = Get-NetTCPConnection -State Listen -LocalPort 3000,3001,3002,3003,3004,3005,3006,3007,3008,3009,3010 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique; if (-not $pids) { Write-Host '  no CML listeners found.' } else { foreach ($procId in $pids) { try { $n = (Get-Process -Id $procId -ErrorAction SilentlyContinue).ProcessName; Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue; Write-Host ('  killed PID ' + $procId + ' (' + $n + ')') } catch {} } }"

echo Done.
