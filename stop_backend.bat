@echo off
setlocal enabledelayedexpansion
title Stop ASCEND Backend

echo ===================================================
echo             Stopping ASCEND Backend
echo ===================================================

set "FOUND=0"

REM Find process listening on port 8000
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr /r ":8000\>" ^| findstr "LISTENING"') do (
    set "PID=%%a"
    if not "!PID!"=="" if not "!PID!"=="0" (
        echo [INFO] Found backend process on port 8000 (PID: !PID!)
        taskkill /F /T /PID !PID! >nul 2>&1
        if !errorlevel! equ 0 (
            echo [SUCCESS] Successfully terminated process PID !PID!.
            set "FOUND=1"
        ) else (
            echo [WARNING] Could not terminate process PID !PID!. It may have already exited.
        )
    )
)

if "!FOUND!"=="0" (
    echo [INFO] No active backend server found running on port 8000.
) else (
    echo [SUCCESS] Backend server stopped successfully.
)

echo.
endlocal
