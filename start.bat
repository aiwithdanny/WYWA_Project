@echo off
REM WYWA dev launcher — works from any folder, no hardcoded paths.
echo Starting WYWA Project...
start "WYWA Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"
start "WYWA Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"
echo Both servers started!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
pause
