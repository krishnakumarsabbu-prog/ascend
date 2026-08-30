#!/usr/bin/env bash
# ASCEND Backend Startup Script (Bash)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"

echo "==================================================="
echo "            Starting ASCEND Backend                "
echo "==================================================="

cd "$BACKEND_DIR"

# 1. Activate virtual environment if present
if [ -f ".venv/bin/activate" ]; then
    echo "[INFO] Activating virtual environment (.venv)..."
    source .venv/bin/activate
elif [ -f "venv/bin/activate" ]; then
    echo "[INFO] Activating virtual environment (venv)..."
    source venv/bin/activate
elif [ -f "../.venv/bin/activate" ]; then
    echo "[INFO] Activating virtual environment (../.venv)..."
    source ../.venv/bin/activate
elif [ -f "../venv/bin/activate" ]; then
    echo "[INFO] Activating virtual environment (../venv)..."
    source ../venv/bin/activate
fi

# 2. Determine Python executable
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
else
    echo "[ERROR] Python is not installed or not in PATH."
    exit 1
fi

echo "[INFO] Starting Uvicorn server on http://127.0.0.1:8000"
echo "[INFO] API Documentation: http://127.0.0.1:8000/docs"
echo "[INFO] Press CTRL+C to stop."
echo ""

$PYTHON_CMD -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
