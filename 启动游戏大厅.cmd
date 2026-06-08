@echo off
setlocal

cd /d "%~dp0"

set "GAME_URL=http://127.0.0.1:5173/"
set "PNPM_HOME=%LOCALAPPDATA%\pnpm"

if exist "%PNPM_HOME%" (
  set "PATH=%PNPM_HOME%;%PATH%"
)

echo ========================================
echo Family Game Hub Launcher
echo ========================================
echo.

if not exist "package.json" (
  echo package.json was not found.
  echo Please put this file in the project root folder, then run it again.
  echo.
  pause
  exit /b 1
)

where pnpm >nul 2>nul
if errorlevel 1 (
  echo pnpm was not found.
  echo Please install pnpm first, then run this file again.
  echo.
  echo If pnpm was just installed, close this window and try again.
  echo.
  pause
  exit /b 1
)

node --version >nul 2>nul
if errorlevel 1 (
  echo A working Node.js command was not found.
  echo Please install Node.js, or make sure %PNPM_HOME%\node.exe can run.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\vite" (
  echo Project dependencies are missing.
  echo Press any key to run pnpm install. This may take a few minutes.
  echo Internet access may be required.
  echo.
  pause
  echo.
  pnpm install --config.confirmModulesPurge=false
  if errorlevel 1 (
    echo.
    echo Dependency installation failed. Please check the error above.
    echo.
    pause
    exit /b 1
  )
)

echo Starting the game hub...
echo The browser will open shortly: %GAME_URL%
echo.
echo Close this window to stop the game service.
echo.

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process '%GAME_URL%'"
pnpm dev

echo.
echo Game service stopped.
pause
