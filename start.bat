@echo off
echo Starting WYWA Project...
start cmd /k "cd /d \"C:\Users\STUDENT\Desktop\Danny Projects\Waziristan youth forum project\frontend\" && npm run dev"
start cmd /k "cd /d \"C:\Users\STUDENT\Desktop\Danny Projects\Waziristan youth forum project\backend\" && npm run dev"
echo Both servers started!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
pause
