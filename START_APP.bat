@echo off
echo ==========================================
echo Starting MaysMelody Media Player...
echo ==========================================

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install it from https://nodejs.org/
    pause
    exit /b
)

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo [1/2] Installing player components (this may take a minute)...
    call npm install
)

:: Run the app
echo [2/2] Launching MaysMelody...
call npm run dev
pause
