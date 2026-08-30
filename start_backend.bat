@echo off
setlocal
title ASCEND Backend Server

echo ===================================================
echo             Starting ASCEND Backend
echo ===================================================

cd /d "%~dp0backend"

REM Check for virtual environment in backend or root directory
if exist ".venv\Scripts\activate.bat" (
    echo [INFO] Activating virtual environment: backend\.venv
    call .venv\Scripts\activate.bat
    goto :check_python
)

if exist "venv\Scripts\activate.bat" (
    echo [INFO] Activating virtual environment: backend\venv
    call venv\Scripts\activate.bat
    goto :check_python
)

if exist "%~dp0.venv\Scripts\activate.bat" (
    echo [INFO] Activating virtual environment: .venv
    call "%~dp0.venv\Scripts\activate.bat"
    goto :check_python
)

if exist "%~dp0venv\Scripts\activate.bat" (
    echo [INFO] Activating virtual environment: venv
    call "%~dp0venv\Scripts\activate.bat"
    goto :check_python
)

echo [INFO] No virtual environment found. Using system Python...

:check_python
set "PYTHON_CMD="
where python >nul 2>&1 && set "PYTHON_CMD=python"
if "%PYTHON_CMD%"=="" where py >nul 2>&1 && set "PYTHON_CMD=py"
if "%PYTHON_CMD%"=="" where py.exe >nul 2>&1 && set "PYTHON_CMD=py.exe"
if "%PYTHON_CMD%"=="" if exist "%LocalAppData%\Programs\Python\Launcher\py.exe" set "PYTHON_CMD=%LocalAppData%\Programs\Python\Launcher\py.exe"

if "%PYTHON_CMD%"=="" (
    echo [ERROR] Neither 'python' nor 'py' was found on your PATH.
    echo Please install Python 3.10+ and add it to your PATH.
    pause
    exit /b 1
)

echo [INFO] Found Python launcher: %PYTHON_CMD%
echo [INFO] Starting Uvicorn server on http://127.0.0.1:8000
echo [INFO] API Documentation: http://127.0.0.1:8000/docs
echo [INFO] Press CTRL+C to stop the server.
echo.

"%PYTHON_CMD%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

endlocal
