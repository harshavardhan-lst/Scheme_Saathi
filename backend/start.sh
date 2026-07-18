#!/bin/sh
set -e

echo "Running database initialization and seeding..."
if [ -n "$DATABASE_URL" ]; then
    python -m app.utils.seed
else
    echo "Warning: DATABASE_URL not set. Skipping tables initialization."
fi

echo "Starting FastAPI server on port 7860..."
exec uvicorn app.main:app --host 0.0.0.0 --port 7860
