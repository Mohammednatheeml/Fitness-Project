@echo off
echo Starting Fitness App...

:: Start Backend
start cmd /k "cd backend && npx nodemon server.js"

:: Start Frontend
start cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173 (usually)
echo.
pause
