# ASCEND Backend Startup Script (PowerShell)
$Host.UI.RawUI.WindowTitle = "ASCEND Backend Server"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "            Starting ASCEND Backend                " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$BackendDir = Join-Path $ScriptDir "backend"

Set-Location $BackendDir

# 1. Check if port 8000 is occupied
$connections = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
if ($connections) {
    $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    Write-Host "[WARNING] Port 8000 is already in use by PID(s): $($pids -join ', ')" -ForegroundColor Yellow
    Write-Host "Run .\stop_backend.ps1 to terminate the existing process.`n" -ForegroundColor Yellow
}

# 2. Activate virtual environment if present
$venvActivated = $false
$venvPaths = @(
    (Join-Path $BackendDir ".venv\Scripts\Activate.ps1"),
    (Join-Path $BackendDir "venv\Scripts\Activate.ps1"),
    (Join-Path $ScriptDir ".venv\Scripts\Activate.ps1"),
    (Join-Path $ScriptDir "venv\Scripts\Activate.ps1")
)

foreach ($path in $venvPaths) {
    if (Test-Path $path) {
        Write-Host "[INFO] Activating virtual environment from $path" -ForegroundColor Green
        & $path
        $venvActivated = $true
        break
    }
}

if (-not $venvActivated) {
    Write-Host "[INFO] No virtual environment found. Using system Python launcher..." -ForegroundColor Gray
}

# 3. Check for python or py
$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $pythonCmd = "py"
} else {
    Write-Host "[ERROR] Neither 'python' nor 'py' was found on your PATH." -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Starting Uvicorn server on http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "[INFO] API Documentation available at: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "[INFO] Press CTRL+C to stop the server.`n" -ForegroundColor Gray

& $pythonCmd -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
