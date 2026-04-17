#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/jackziegler/Projects/Shyfty"
BACKEND_DIR="$ROOT/backend"
WEB_DIR="$ROOT/web"
IOS_PROJECT="$ROOT/ios/Shyfty/Shyfty.xcodeproj"

BACKEND_PORT=8001
WEB_PORT=5175

kill_port() {
  local port="$1"
  local pids
  pids="$(lsof -ti tcp:"$port" || true)"
  if [[ -n "$pids" ]]; then
    echo "Killing processes on port $port: $pids"
    kill $pids || true
    sleep 1
    pids="$(lsof -ti tcp:"$port" || true)"
    if [[ -n "$pids" ]]; then
      echo "Force killing processes on port $port: $pids"
      kill -9 $pids || true
    fi
  fi
}

echo "Cleaning up old dev processes..."
kill_port "$BACKEND_PORT"
kill_port "$WEB_PORT"

mkdir -p "$ROOT/.run"

echo "Starting backend on :$BACKEND_PORT ..."
cd "$BACKEND_DIR"
if [[ ! -d ".venv" ]]; then
  echo "Missing backend virtualenv at $BACKEND_DIR/.venv"
  echo "Create it first:"
  echo "  cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
  exit 1
fi

(
  source .venv/bin/activate
  export DATABASE_URL="${DATABASE_URL:-postgresql+psycopg://postgres:postgres@localhost:5432/shyfty}"
  uvicorn app.main:app --reload --host 0.0.0.0 --port "$BACKEND_PORT"
) > "$ROOT/.run/backend.log" 2>&1 &
BACKEND_PID=$!
echo "$BACKEND_PID" > "$ROOT/.run/backend.pid"

sleep 2

echo "Starting React dev server on :$WEB_PORT ..."
cd "$WEB_DIR"
(
  npm run dev
) > "$ROOT/.run/web.log" 2>&1 &
WEB_PID=$!
echo "$WEB_PID" > "$ROOT/.run/web.pid"

sleep 2

echo "Opening iOS project..."
open "$IOS_PROJECT"

echo
echo "Started:"
echo "  Backend: http://192.168.0.28:$BACKEND_PORT/api"
echo "  Web:     http://localhost:$WEB_PORT"
echo
echo "Logs:"
echo "  tail -f $ROOT/.run/backend.log"
echo "  tail -f $ROOT/.run/web.log"
