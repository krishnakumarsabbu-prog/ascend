#!/usr/bin/env bash
# ASCEND Backend Stop Script (Bash)

echo "==================================================="
echo "            Stopping ASCEND Backend                "
echo "==================================================="

PORT=8000
PID=$(lsof -ti :$PORT 2>/dev/null || true)

if [ -n "$PID" ]; then
    echo "[INFO] Found process $PID on port $PORT. Terminating..."
    kill -9 $PID 2>/dev/null || true
    echo "[SUCCESS] Backend stopped."
else
    echo "[INFO] No active backend server found running on port $PORT."
fi
