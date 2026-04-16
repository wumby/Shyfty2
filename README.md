# Shyfty

Shyfty is a sports signal engine for NBA and NFL player volatility. The product surfaces spikes, drops, shifts, consistency, and outlier events as a real-time feed rather than a traditional stats dashboard.

## Architecture

Text diagram:

- `backend/`
  FastAPI app with SQLAlchemy models, Alembic-managed schema, domain logic, REST endpoints, and Postgres persistence
- `scripts/`
  Thin operational entrypoints for seeding and signal generation
- `web/`
  React + TypeScript + Vite client using Zustand, React Router, Tailwind, and Recharts
- `ios/`
  SwiftUI client using URLSession, NavigationStack, and Swift Charts
- `infra/`
  Docker Compose for Postgres and the backend API

## Folder Structure

```text
Shyfty/
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── domain/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── Dockerfile
│   └── requirements.txt
├── infra/
│   └── docker-compose.yml
├── ios/
│   └── Shyfty/
│       ├── Shyfty/
│       └── Shyfty.xcodeproj/
├── scripts/
│   ├── run_signal_engine.py
│   └── seed_db.py
└── web/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── store/
    │   └── types/
    └── package.json
```

## Backend Setup

### Option 1: Docker

1. `cd infra`
2. `docker compose up --build -d`

Then seed and generate signals from the repo root:

1. `cd backend`
2. `python3 -m venv .venv`
3. `source .venv/bin/activate`
4. `pip install -r requirements.txt`
5. `export DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/shyfty`
6. `alembic upgrade head`
7. `python ../scripts/seed_db.py`
8. `python ../scripts/run_signal_engine.py`

### Option 2: Local backend only

1. Start Postgres locally
2. `cd backend`
3. `python3 -m venv .venv`
4. `source .venv/bin/activate`
5. `pip install -r requirements.txt`
6. `export DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/shyfty`
7. `alembic upgrade head`
8. `uvicorn app.main:app --reload --port 8001`

## Web Setup

1. `cd web`
2. `npm install`
3. `npm run dev`

Optional:

- `VITE_API_BASE_URL=http://127.0.0.1:8001/api npm run dev`

## iOS Setup

1. Open [ios/Shyfty/Shyfty.xcodeproj](/Users/jackziegler/Projects/Shyfty/ios/Shyfty/Shyfty.xcodeproj)
2. Run the `Shyfty` scheme in the iOS simulator
3. Ensure the backend is available on `http://127.0.0.1:8001/api`

## Seeding and Signal Generation

- Run migrations first: `cd backend && alembic upgrade head`
- `python scripts/seed_db.py`
- `python scripts/run_signal_engine.py`

`scripts/seed_db.py` and `scripts/run_signal_engine.py` are thin entrypoints over backend CLI modules.
Generation logic lives in `backend/app/domain/signals.py` and `backend/app/services/signal_generation_service.py`.

The seed dataset includes:

- NBA: Luka Doncic, Nikola Jokic, Stephen Curry
- NFL: Patrick Mahomes, Josh Allen, Justin Jefferson

The signal engine computes rolling averages, rolling standard deviation, z-scores, and writes signal records using these rules:

- `SPIKE`: `z >= 1.5`
- `DROP`: `z <= -1.5`
- `OUTLIER`: `|z| >= 2.5`
- `SHIFT`: usage-rate z-score magnitude `>= 1.0`
- `CONSISTENCY`: low recent variance

The generator now backfills all eligible historical game contexts, not just the latest one, and reruns update existing contexts instead of recreating duplicate rows.

## Tests

- `cd backend && .venv/bin/python -m unittest discover -s tests -q`

## API Overview

- `GET /api/health`
- `GET /api/signals`
- `GET /api/players`
- `GET /api/players/{id}`
- `GET /api/players/{id}/signals`
- `GET /api/players/{id}/metrics`
- `GET /api/teams`

## Real vs Mocked

Real:

- Postgres-backed schema
- Alembic-managed schema lifecycle
- Seeded player, team, game, stat, rolling metric, and signal records
- Signal generation service writing idempotent historical rolling metric and signal records
- Web and iOS clients fetching live API data

Mocked or simplified:

- No external sports data ingestion yet
- No auth, favorites persistence, or push notifications
- Limited player pool and no live scheduling service

## Next Steps To Productionize

1. Replace static seed inputs with sportsbook or official league data ingestion.
2. Add background jobs for scheduled recomputation and cache invalidation.
3. Add auth, saved filters, favorites persistence, and alert delivery.
4. Harden migrations, tests, observability, and deploy environments.

## Migration Notes

- The API no longer auto-creates tables on startup. Run `alembic upgrade head` before seeding or starting the backend against a fresh database.
- `0002_signal_generation_context` adds `game_id` to `signals` and `rolling_metrics`.
- Existing environments with data should apply Alembic before running the refactored signal engine so existing rows are backfilled with the latest known game context.
