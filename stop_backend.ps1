# ASCEND Backend Stop Script (PowerShell)
$Host.UI.RawUI.WindowTitle = "Stop ASCEND Backend"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "            Stopping ASCEND Backend                " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$connections = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue

if ($connections) {
    $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($procId in $pids) {
        if ($procId -gt 0) {
            try {
                $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
                $procName = if ($proc) { $proc.ProcessName } else { "Unknown" }
                Write-Host "[INFO] Terminating process $procName (PID: $procId) on port 8000..." -ForegroundColor Yellow
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                Write-Host "[SUCCESS] Terminated PID $procId." -ForegroundColor Green
            } catch {
                Write-Host "[WARNING] Could not terminate process PID ${procId}: $_" -ForegroundColor Yellow
            }
        }
    }
    Write-Host "[SUCCESS] Backend server stopped." -ForegroundColor Green
} else {
    Write-Host "[INFO] No active backend server found running on port 8000." -ForegroundColor Gray
}
