@echo off
echo Stopping CML services...

taskkill /FI "WINDOWTITLE eq CML API*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq CML Worker*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq CML Web*" /T /F >nul 2>&1

echo Done.
