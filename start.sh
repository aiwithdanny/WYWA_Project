#!/usr/bin/env bash
# WYWA dev launcher (macOS / Linux) — run from the repo root:  ./start.sh
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "Starting WYWA Project..."
(cd "$ROOT/frontend" && npm run dev) &
(cd "$ROOT/backend" && npm run dev) &
echo "Both servers started!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
wait
